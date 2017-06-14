#C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/RecifeTransportation.geojson
import geojson
import csv
from decimal import Decimal
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
    
        dist = calcDist(lat, long, x.geometry.coordinates[1], x.geometry.coordinates[0])
        if dist < radius:
            counts = counts + (radius - dist)/radius
    	
    return counts

#dict = eval(open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/gridOutput.log', 'r').read())

#section = "Transportation"
#f = open('pythonOutPut' + section + '.js', 'w')

#for keys in dict:
#    lat = dict.get(keys)[0]
#    long = dict.get(keys)[1]
#    f.write("{id: " + str(keys) + ", hits :" + str(hits(long, lat, 1000, section)) + "},\n")

#f.close();

with open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/anuncios-de-imoveis-recife-pe.csv', encoding="utf8") as csvfile, open('apartments.csv', 'w', encoding='utf8' ) as f:
    reader = csv.DictReader(csvfile)
    writer = csv.DictWriter(f, fieldnames=reader.fieldnames, lineterminator='\n')
    writer.writeheader()

    preco = 0;
    quartos = 0;
    suites = 0;
    area = 0;
    vagas = 0;
    taxa = 0;
    iptu = 0;

    count = 0
    for row in reader:
        print(len(row['Preço']) != 0 and
           len(row['Quartos']) != 0 and
           len(row['Suítes']) != 0 and
           len(row['Área Útil (m2)']) != 0 and
           len(row['Vagas']) != 0 and
           len(row['Taxa Condomínio']) != 0 )
        
        if(len(row['Preço']) != 0 and
           len(row['Quartos']) != 0 and
           len(row['Suítes']) != 0 and
           len(row['Área Útil (m2)']) != 0 and
           len(row['Vagas']) != 0 and
           len(row['Taxa Condomínio']) != 0 ):
            
                count = count + 1;
                preco += float(row['Preço']);
                quartos += float(row['Quartos']);
                suites += float(row['Suítes']);
                area += float(row['Área Útil (m2)']);
                vagas += float(row['Vagas']);
                taxa += Decimal(row['Taxa Condomínio']);

    print(preco/count)
    print(count)
        
    #for row in reader:
     #   row['Education'] = hits(row['Latitude'], row['Longitude'], 1000, 'Education')
      #  row['Entertainment'] = hits(row['Latitude'], row['Longitude'], 1000, 'Entertainment')
       # row['Financial'] = hits(row['Latitude'], row['Longitude'], 1000, 'Financial')
        #row['Healthcare'] = hits(row['Latitude'], row['Longitude'], 1000, 'Healthcare')
        #row['Sustenance'] = hits(row['Latitude'], row['Longitude'], 1000, 'Sustenance')
        #row['Transportation'] = hits(row['Latitude'], row['Longitude'], 1000, 'Transportation')
        #row['Others'] = hits(row['Latitude'], row['Longitude'], 1000, 'Others')
        #writer.writerow(row)

    
