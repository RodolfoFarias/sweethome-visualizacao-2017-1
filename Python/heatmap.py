#C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/RecifeTransportation.geojson
import geojson
from geopy.distance import vincenty

def calcDist(lat1, long1, lat2, long2):
    #vincenty (lat,long) , (lat,long)
    
    return vincenty((lat1, long1), (lat2, long2)).meters

#Sections:
#   Education
#   Entertainment
#   Financial
#   Healthcare
#   Others
#   Sustenance
#   Transportation

def hits(lat, long, radius, section):
    path = "C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/Recife" + section + ".geojson"
    json_data=open(path).read()
    data = geojson.loads(json_data)
    counts = 0;

    for x in data.features:
    
        dist = calcDist(lat, long, x.geometry.coordinates[0], x.geometry.coordinates[1])
        if dist < radius:
            counts = counts + (radius - dist)/radius
    	
    return counts

dict = eval(open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/gridOutput.log', 'r').read())

section = "Transportation"
f = open('pythonOutPut' + section + '.js', 'w')

for keys in dict:
    lat = dict.get(keys)[0]
    long = dict.get(keys)[1]
    f.write("{id: " + str(keys) + ", hits :" + str(hits(long, lat, 1000, section)) + "},\n")

f.close();
