all: splash pull 
	@echo ''
	make install -j

splash:
	# stty size | awk '{print $2}'
	# tput cols | awk '{system("cut -c1-"  $2 " splash.txt")}'
	# cut -c1-$(tput cols) splash.txt
	cut -c1-100 splash.txt

pull:
	git pull

push:
	git add -A && git commit -m 'makefile' && git push 

single:
	screen -d -S computing -m 'pkill -9 python; python3 pipeline.py'
	make view

pipeline:
	@echo "Creating empty text files..."
	
install:
	@echo "Installing dependancies"
	# sudo pkill -9 apt 
	sudo apt update
	
	# python 
	sudo apt install python3-pip --yes 
	pip install pandas numpy geopandas mercantile p_tqdm halo
	pip install protobuf==3.20.*
	pip install git+https://github.com/mapbox/vector-tile-base 

	# if f2py compiler is missing 
	sudo apt-get install gfortran --yes 
	python3 -m numpy.f2py -c tilefunctions.f90 -m customtiles 

	# tippiecanoe
	sudo apt-get install build-essential libsqlite3-dev zlib1g-dev --yes
	mkdir tippecanoe; rm -rf tippecanoe
	git clone https://github.com/mapbox/tippecanoe.git 
	cd tippecanoe && make -j && sudo make install && cd ../ && rm -rf ../tippecanoe

	sudo apt-get install htop --yes
	sudo apt install screen --yes

view:
	screen -S computing
	