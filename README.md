## End to end Machine Learning Project

pip install -e .

## Run from terminal:

docker build -t mlprojectdocker.azurecr.io/studentperformancemlproject:latest .

docker login mlprojectdocker.azurecr.io

docker push mlprojectdocker.azurecr.io/studentperformancemlproject:latest