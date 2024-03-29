'''
Dependancies: 
    Run the makefile supplied: `make -j`

Purpose: 
    A processing script for OA level census data to dot-density    

Author: Daniel Elis 
'''

#########################
# Parameters 
#########################

SKIP_SAVE = True
TIPPIECANOE = False
GZIP = True 

# locations must have "/" at the end
DLOC = '../../Inputs/data/' # data location
GEOMLOC = '../../Inputs/geom.shp'
OUTPUTLOC = '../../ProcessedFiles/'



'''
Imports
'''
import os, sys, glob, gzip, time
sys.setrecursionlimit(2500)
from halo import Halo
from multiprocessing import cpu_count
from p_tqdm import p_uimap,p_umap
from functools import partial
import numpy as np
import pandas as pd
import geopandas as gpd
import mercantile, vector_tile_base

'''
Constants
'''
RECURSIVE=3
EXTENT = 4096
HALF_EXTENT = EXTENT/2 
HALF_BUFFER = 2./14. * HALF_EXTENT
NCPUS = cpu_count()
w = os.get_terminal_size().columns
print(os.popen(f'cut -c1-{w} splash.txt').read())



'''
Common Functions
'''

# input output
if GZIP:
    io = gzip.open
    GZIP = ''# commented out .gz 
else:
    io = open
    GZIP=''


# spinner
spinner = Halo(text='Bleep Blop Beep', spinner='dots')

def spin(text):
    global spinner
    spinner.text = text
    spinner.start()


# f90
spin('Compiling Fortran')
'''this uses / compiles the fortran libraries. If the code falls over here delete the .so files and rerun. '''
try:
    from customtiles import * 
except:    
    os.popen('python3 -m numpy.f2py -c tilefunctions.f90 -m customtiles').read()
    from customtiles import * 
spinner.stop()


# directory
def mkdir(loc):
    try: os.mkdir(loc)
    except:...

mkdir(OUTPUTLOC)






if __name__ == '__main__':

    start = time.time()
    #############################
    # DatasetSelection UI
    #############################
    '''
    This section has two possible input styles. 
    1. You can provide a file as an argument:
        python pipeline.py path/to/file.csv
    2. Select from the Dropdown Menu
    '''
    try: 
        typen = sys.argv[1]
        assert os.path.exists(typen), 'File does not exist'
    except:
        typen = glob.glob(DLOC+'TS*.csv')

        assert len(typen), 'No files found, check your path: '+DLOC
        for i in enumerate(typen):
            print(i)

        typen = typen[int(input('Select Value: '))]

    typen = typen.split('/')[-1].split('.')[0]
    print(typen)
    os.system('date')




    '''
    The full generation cycle for a single dataset is given below. 
    '''
    # updated output location 
    oloc = OUTPUTLOC+typen
    mkdir(oloc)


    ''' Lets  load all relevant data '''
    spin(f'Reading geometry')
    geom = gpd.read_file(GEOMLOC,engine='pyogrio').set_index('OA21CD') #pyogrio seems massively faster than fiona
    geom = geom.geometry

    spin(f'Reading {typen}')
    data = pd.read_csv(DLOC+typen+'.csv').set_index('Geography code')
    
    # automatically select the sections with data in them. 
    start = list(data.columns).index('Classification') + 1
    end = list(data.columns).index('Total')
    selection = list(data.columns)[start:end]
    data = data[selection]

    # combine the 
    oas = list(set(data.index) & set(geom.index))
    np.random.shuffle(oas)

    spinner.stop()


    #############################
    #  Funciton to generate the points. 
    #############################


    def makepoints(area_chunks,groupby = 15):
        '''This functions processes the points for several areas'''
        dummy = []

        for area in area_chunks:
            row = data.loc[area]
            for cid,col in enumerate(selection):
                    # for each category
                    polygon = geom.loc[area]
                    ptcds = [i[0] for i in polygon.centroid.xy]
                    # convert geometry into a list of coordinates
                    try: poly = np.array(polygon.exterior.coords.xy).tolist()
                    except AttributeError:
                        poly = np.array(polygon.geoms[0].exterior.coords.xy).tolist()
                    points = []

                    counter = 0
                    nvar = int(row[col])
                    nstop= int(nvar*1.5) #  max range as to avoid infinte loops
                    minx, miny, maxx, maxy = polygon.bounds

                    for coords in np.array([np.random.uniform(minx, maxx, nstop), np.random.uniform(miny, maxy, nstop)]).T:
                        

                        # CHANGED TO LIST
                        coords = list(coords)


                        if len(coords) and point_in_polygon(*coords,*poly): 
                            points.append(coords)
                            counter += 1
                            if counter >= nvar:
                                break
                    
                            # each time we get a len of "groupby" points, write to array 
                            if len(points)>groupby:
                                dummy.append([cid,points,*ptcds])
                                points = []

                    # write any leftover points 
                    if len(points):
                        dummy.append([cid,points,*ptcds])

        #  shuffle the points to induce randomness. 
        np.random.shuffle(dummy)
        return dummy


    #############################
    #  Actually generate these points in 'll
    #############################


    try:
        spin('Loading pre-computed points')
        gdf = pd.read_pickle(f'{oloc}/points.pkl')
        spinner.stop()
    except:
        spinner.text = 'Calculating points'
        spinner.stop()
        split = np.array_split(oas,NCPUS)#80
        print(len(split[0]),'per core. (',NCPUS,' cores total)')

        res = []
        iterator = p_uimap(makepoints,split)
        for l in iterator:
            res.extend(l)

        spin('Sorting computed points. ')
        gdf = pd.DataFrame(np.array(res,dtype=object))
        gdf.columns = 'cat point x y'.split()
        gdf = gdf.sort_values('x y'.split()).reset_index()
        spinner.text = 'Saving computed points'

        if not SKIP_SAVE: gdf.to_pickle(f'{oloc}/points.pkl')

        with open(f'{oloc}/.gitignore','a') as f:
            f.write('\n *.pkl')

        spinner.stop()





    # from memory_profiler import profile
    # @profile
    def gunwale_bobbing(schema,it=0,subset=[]):
        
        x,y,z = schema
        bbox = mercantile.bounds(x,y,z)
        
        if not len(subset):
            subset = gdf.loc[gdf['x'].between(bbox.west,bbox.east) & gdf['y'].between(bbox.south,bbox.north)]
        
        if not len(subset): return 0 

        vt = vector_tile_base.VectorTile()
        layer = vt.add_layer('custom_data_dan')
        layer.EXTENT=EXTENT

        by = 2**(14-int(z))
        if by < 1: return 0 # stop at 0 

        counter = 0 
        for _,multipoint in subset.iterrows():

            for point_ix in range(by,len(multipoint['point']),by):     # [z%2::by]: 
                    try:
                        feature = layer.add_point_feature()
                        feature.add_points(list(transform_geo(*bbox, *multipoint['point'][point_ix], EXTENT))) 
                        feature.attributes = { 'cat': multipoint['cat'] }
                    except: ...

        
        encoded_tile = vt.serialize()
        output = oloc

        try:
            with io(f'{output}/{z}/{x}/{y}.pbf'+GZIP,'wb') as f:
                f.write(encoded_tile)
        except:
            mkdir(f'{output}/{z}')
            mkdir(f'{output}/{z}/{x}')
            with io(f'{output}/{z}/{x}/{y}.pbf'+GZIP,'wb') as f:
                f.write(encoded_tile)

            
        
        if it<RECURSIVE:
            tiles = list(mercantile.tiles(*bbox, zooms=[z+1]))
            # recursive processing
            for t in tiles:
                
                bbox = mercantile.bounds(t)
                subset2 = subset.loc[subset['x'].between(bbox.west,bbox.east) & subset['y'].between(bbox.south,bbox.north)]
                gunwale_bobbing(t,it+1,subset2)

        # last ditch attempt at garbage collection
        for x in list(locals()):
            del locals()[x]

        return 0 
                
    ##########################
    # Generate Summary table
    ##########################


    if TIPPIECANOE:

        spin('Saving* Ratios GeoJSON')

        geom = gpd.GeoDataFrame(geom)
        geom['ratios'] = [str(list(data.loc[i].values)).replace(' ','') for i in geom.index]

        if not os.path.exists(oloc+'/ratio.geojson'):
            geom.to_file(oloc+'/ratio.geojson', driver="GeoJSON")  

        spinner.text = 'Tippicanoe'
        # #### MAY NOT WORK ON WINDOWS
        os.system(f'cd {oloc};rm -rf ratios; mkdir ratios/;  tippecanoe -zg --no-tile-compression --simplification=10 --simplify-only-low-zooms --no-tile-size-limit --force --read-parallel --output-to-directory=ratios/ ratio.geojson')
        
        # os.system(f'echo "*.geojson" >> {oloc}/.gitignore')
        with open(f'{oloc}/.gitignore','a') as f:
            f.write('\n *.geojson')
        spinner.stop()



    del geom


    #############################
    # computations 
    #############################

    yn = gdf.y.min()
    yx = gdf.y.max()
    xn = gdf.x.min()
    xx = gdf.x.max()

    bounds = (xn,yn,xx,yx)
    # bounds = (-0.488892,51.280817,0.189514,51.699800)
    print(' Not deleting previous computations. You may wish to do this manually. ')

    #  it may be better to treat each one individually - thus allowing adequate garbage collection
    #  we compute zoom levels with 3 levels of recursion that is in sets of 64 tiles (4**3) 
    tiles = list(mercantile.tiles(*bounds, zooms=list(range(7,15,RECURSIVE))))
    np.random.shuffle(tiles)
    chunks = int(len(tiles)//(NCPUS*100))
    for _,grouping in enumerate(np.array_split(tiles,chunks)):
        print(f'Layer set {_+1} of {chunks}')
        p_umap(gunwale_bobbing,grouping)

  

    ##########################
    # gen switch code
    ##########################

    s = data.sum()
    s = 100*(s/s.max())
    s=s.astype(np.float16)

    options = f'''
    case "{typen}":
        keys = {selection}
        csum = {list(s.values)}
        bcsum = {list(s.values)}
        break;
    '''

    with open(f'{oloc}/switch.txt','w') as f:
        f.write(options)

    print(typen)
    print('\n\n Execition took %d  \n\n'%((time.time()-start)))
    print(options)





