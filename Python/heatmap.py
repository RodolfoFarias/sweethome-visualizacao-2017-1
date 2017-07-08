#C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/RecifeTransportation.geojson
import geojson
import csv
import numpy as np
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

#dict = eval(open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/gridOutput2.log', 'r').read())

#section = "Transportation"
#f = open('pythonOutPut' + section + '.js', 'w')

#for keys in dict:
#    lat = dict.get(keys)[0]
#    long = dict.get(keys)[1]
#    f.write("{id: " + str(keys) + ", hits :" + str(hits(lat, long, 1000, section)) + "},\n")

#f.close();

def hitImoveis():
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
                    taxa += float(row['Taxa Condomínio']);

        preco = preco/count
        quartos = quartos/count
        suites = suites/count
        area = area/count
        vagas = vagas/count
        taxa = taxa/count
        count = 0
        
        reader2 = csv.DictReader(open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/anuncios-de-imoveis-recife-pe.csv', encoding="utf8"))

        for row in reader2:  

            
            if(len(row['Preço']) != 0 and
               len(row['Quartos']) != 0 and
               len(row['Suítes']) != 0 and
               len(row['Área Útil (m2)']) != 0 and
               len(row['Vagas']) != 0 and
               len(row['Taxa Condomínio']) != 0 and
               len(row['Latitude']) != 0 and
               len(row['Longitude']) != 0 and
               len(row['Tipo']) != 0 and
               float(row['Preço']) < (2.5 * preco) and
               float(row['Quartos']) < (2.5 * quartos) and
               float(row['Suítes']) < (2.5 * suites) and
               float(row['Área Útil (m2)']) < (2.5 * area) and
               float(row['Vagas']) < (2.5 * vagas) and
               float(row['Taxa Condomínio']) < (2.5 * taxa) and
               float(row['Longitude']) < -33 and
               float(row['Longitude']) > -35 and
               float(row['Latitude']) < -7 and
               float(row['Latitude']) > -9 and
               row["Tipo"] == "Residencial" 
                    ):
                    
                    count = count + count;
            
                    row['Education'] = hits(row['Latitude'], row['Longitude'], 1000, 'Education')
                    row['Entertainment'] = hits(row['Latitude'], row['Longitude'], 1000, 'Entertainment')
                    row['Financial'] = hits(row['Latitude'], row['Longitude'], 1000, 'Financial')
                    row['Healthcare'] = hits(row['Latitude'], row['Longitude'], 1000, 'Healthcare')
                    row['Sustenance'] = hits(row['Latitude'], row['Longitude'], 1000, 'Sustenance')
                    row['Transportation'] = hits(row['Latitude'], row['Longitude'], 1000, 'Transportation')
                    writer.writerow(row)
					
					
					
					
def hitImoveis2():
    with open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/anuncios-de-imoveis-recife-pe.csv', encoding="utf8") as csvfile, open('apartments.csv', 'w', encoding='utf8' ) as f:
        reader = csv.DictReader(csvfile)
        writer = csv.DictWriter(f, fieldnames=reader.fieldnames, lineterminator='\n')
        writer.writeheader()

        preco = [];
        quartos = [];
        suites = [];
        area = [];
        vagas = [];
        taxa = [];
        iptu = [];

        count = 0
        for row in reader:
            if(len(row['Preço']) != 0 and
               len(row['Quartos']) != 0 and
               len(row['Suítes']) != 0 and
               len(row['Área Útil (m2)']) != 0 and
               len(row['Vagas']) != 0 and
               len(row['Taxa Condomínio']) != 0 ):
                
                    preco.append(float(row['Preço']));
                    quartos.append(float(row['Quartos']));
                    suites.append(float(row['Suítes']));
                    area.append(float(row['Área Útil (m2)']));
                    vagas.append(float(row['Vagas']));
                    taxa.append(float(row['Taxa Condomínio']));

        mediaPreco = np.mean(preco)
        mediaQuartos = np.mean(quartos)
        mediaSuites = np.mean(suites)
        mediaArea = np.mean(area)
        mediaVagas = np.mean(vagas)
        mediaTaxa = np.mean(taxa)

        varianciaPreco = np.var(preco)
        varianciaQuartos = np.var(quartos)
        varianciaSuites = np.var(suites)
        varianciaArea = np.var(area)
        varianciaVagas = np.var(vagas)
        varianciaTaxa = np.var(taxa)

        desvioPreco = np.sqrt(varianciaPreco)
        desvioQuartos = np.sqrt(varianciaQuartos)
        desvioSuites = np.sqrt(varianciaSuites)
        desvioArea = np.sqrt(varianciaArea)
        desvioVagas = np.sqrt(varianciaVagas)
        desvioTaxa = np.sqrt(varianciaTaxa)
        
        reader2 = csv.DictReader(open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/anuncios-de-imoveis-recife-pe.csv', encoding="utf8"))

        for row in reader2:  

            
            if(len(row['Preço']) != 0 and
               len(row['Quartos']) != 0 and
               len(row['Suítes']) != 0 and
               len(row['Área Útil (m2)']) != 0 and
               len(row['Vagas']) != 0 and
               len(row['Taxa Condomínio']) != 0 and
               len(row['Latitude']) != 0 and
               len(row['Longitude']) != 0 and
               len(row['Tipo']) != 0 and
               float(row['Preço']) < (mediaPreco + 2.5 * desvioPreco) and
               float(row['Quartos']) < (mediaQuartos + 2.5 * desvioQuartos) and
               float(row['Suítes']) < (mediaSuites + 2.5 * desvioSuites) and
               float(row['Área Útil (m2)']) < (mediaArea + 2.5 * desvioArea) and
               float(row['Vagas']) < (mediaVagas + 2.5 * desvioVagas) and
               float(row['Taxa Condomínio']) < (mediaTaxa + 2.5 * desvioTaxa) and
               float(row['Preço']) > (mediaPreco - 2.5 * desvioPreco) and
               float(row['Quartos']) > (mediaQuartos - 2.5 * desvioQuartos) and
               float(row['Suítes']) > (mediaSuites - 2.5 * desvioSuites) and
               float(row['Área Útil (m2)']) > (mediaArea - 2.5 * desvioArea) and
               float(row['Vagas']) > (mediaVagas - 2.5 * desvioVagas) and
               float(row['Taxa Condomínio']) > (mediaTaxa - 2.5 * desvioTaxa) and
               float(row['Longitude']) < -33 and
               float(row['Longitude']) > -35 and
               float(row['Latitude']) < -7 and
               float(row['Latitude']) > -9 and
               row["Tipo"] == "Residencial" 
                    ):
                                
                    row['Education'] = hits(row['Latitude'], row['Longitude'], 1000, 'Education')
                    row['Entertainment'] = hits(row['Latitude'], row['Longitude'], 1000, 'Entertainment')
                    row['Financial'] = hits(row['Latitude'], row['Longitude'], 1000, 'Financial')
                    row['Healthcare'] = hits(row['Latitude'], row['Longitude'], 1000, 'Healthcare')
                    row['Sustenance'] = hits(row['Latitude'], row['Longitude'], 1000, 'Sustenance')
                    row['Transportation'] = hits(row['Latitude'], row['Longitude'], 1000, 'Transportation')
                    writer.writerow(row)

        
def hitImoveis3():
    with open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/anuncios-de-imoveis-recife-pe.csv', encoding="utf8") as csvfile, open('apartments.csv', 'w', encoding='utf8' ) as f:
        reader = csv.DictReader(csvfile)
        writer = csv.DictWriter(f, fieldnames=reader.fieldnames, lineterminator='\n')
        writer.writeheader()

        preco = [];
        quartos = [];
        suites = [];
        area = [];
        vagas = [];
        taxa = [];
        

        count = 0
        for row in reader:
            if(len(row['Preço']) != 0 and
               len(row['Quartos']) != 0 and
               len(row['Suítes']) != 0 and
               len(row['Área Útil (m2)']) != 0 and
               len(row['Vagas']) != 0 and
               len(row['Taxa Condomínio']) != 0 ):
                
                    preco.append(float(row['Preço']));
                    quartos.append(float(row['Quartos']));
                    suites.append(float(row['Suítes']));
                    area.append(float(row['Área Útil (m2)']));
                    vagas.append(float(row['Vagas']));
                    taxa.append(float(row['Taxa Condomínio']));

        mediaPreco = np.mean(preco)
        mediaQuartos = np.mean(quartos)
        mediaSuites = np.mean(suites)
        mediaArea = np.mean(area)
        mediaVagas = np.mean(vagas)
        mediaTaxa = np.mean(taxa)

        varianciaPreco = np.var(preco)
        varianciaQuartos = np.var(quartos)
        varianciaSuites = np.var(suites)
        varianciaArea = np.var(area)
        varianciaVagas = np.var(vagas)
        varianciaTaxa = np.var(taxa)

        desvioPreco = np.sqrt(varianciaPreco)
        desvioQuartos = np.sqrt(varianciaQuartos)
        desvioSuites = np.sqrt(varianciaSuites)
        desvioArea = np.sqrt(varianciaArea)
        desvioVagas = np.sqrt(varianciaVagas)
        desvioTaxa = np.sqrt(varianciaTaxa)
        
        reader2 = csv.DictReader(open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/anuncios-de-imoveis-recife-pe.csv', encoding="utf8"))

        for row in reader2:  

            
            if(len(row['Preço']) != 0 and
               len(row['Quartos']) != 0 and
               len(row['Suítes']) != 0 and
               len(row['Área Útil (m2)']) != 0 and
               len(row['Vagas']) != 0 and
               len(row['Taxa Condomínio']) != 0 and
               len(row['Latitude']) != 0 and
               len(row['Longitude']) != 0 and
               len(row['Tipo']) != 0 and
               float(row['Preço']) < (mediaPreco + 2.5 * desvioPreco) and
               float(row['Quartos']) < (mediaQuartos + 2.5 * desvioQuartos) and
               float(row['Suítes']) < (mediaSuites + 2.5 * desvioSuites) and
               float(row['Área Útil (m2)']) < (mediaArea + 2.5 * desvioArea) and
               float(row['Vagas']) < (mediaVagas + 2.5 * desvioVagas) and
               float(row['Taxa Condomínio']) < (mediaTaxa + 2.5 * desvioTaxa) and
               float(row['Preço']) > (mediaPreco - 2.5 * desvioPreco) and
               float(row['Quartos']) > (mediaQuartos - 2.5 * desvioQuartos) and
               float(row['Suítes']) > (mediaSuites - 2.5 * desvioSuites) and
               float(row['Área Útil (m2)']) > (mediaArea - 2.5 * desvioArea) and
               float(row['Vagas']) > (mediaVagas - 2.5 * desvioVagas) and
               float(row['Taxa Condomínio']) > (mediaTaxa - 2.5 * desvioTaxa) and
               float(row['Longitude']) < -33 and
               float(row['Longitude']) > -35 and
               float(row['Latitude']) < -7 and
               float(row['Latitude']) > -9 and
               row["Tipo"] == "Residencial" 
                    ):
                                
                    writer.writerow(row)

        
def conta(number):
    reader = csv.DictReader(open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/anuncios-de-imoveis-recife-pe.csv', encoding="utf8"))


    preco = [];
    quartos = [];
    suites = [];
    area = [];
    vagas = [];
    taxa = [];
       

    count = 0
    for row in reader:
        if(len(row['Preço']) != 0 and
        len(row['Quartos']) != 0 and
        len(row['Suítes']) != 0 and
        len(row['Área Útil (m2)']) != 0 and
        len(row['Vagas']) != 0 and
        len(row['Taxa Condomínio']) != 0 ):
            count = count + 1;
            preco.append(float(row['Preço']));
            quartos.append(float(row['Quartos']));
            suites.append(float(row['Suítes']));
            area.append(float(row['Área Útil (m2)']));
            vagas.append(float(row['Vagas']));
            taxa.append(float(row['Taxa Condomínio']));
                    
    preco = sorted(preco)
    quartos = sorted(quartos)
    suites = sorted(suites)
    area = sorted(area)
    vagas = sorted(vagas)
    taxa = sorted(taxa)
    
    print("Preço",preco[int(number * count)])
    print("quartos",quartos[int(number * count)])
    print("suites",suites[int(number * count)])
    print("area",area[int(number * count)])
    print("vagas",vagas[int(number * count)])
    print("taxa",taxa[int(number * count)])


    
def hitImoveis4():
    with open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/anuncios-de-imoveis-recife-pe.csv', encoding="utf8") as csvfile, open('apartments.csv', 'w', encoding='utf8' ) as f:
        reader = csv.DictReader(csvfile)
        writer = csv.DictWriter(f, fieldnames=reader.fieldnames, lineterminator='\n')
        writer.writeheader()

        preco = [];
        quartos = [];
        suites = [];
        area = [];
        vagas = [];
        taxa = [];
        

        count = 0
        for row in reader:
            if(len(row['Preço']) != 0 and
               len(row['Quartos']) != 0 and
               len(row['Suítes']) != 0 and
               len(row['Área Útil (m2)']) != 0 and
               len(row['Vagas']) != 0 and
               len(row['Taxa Condomínio']) != 0 ):
                
                    preco.append(float(row['Preço']));
                    quartos.append(float(row['Quartos']));
                    suites.append(float(row['Suítes']));
                    area.append(float(row['Área Útil (m2)']));
                    vagas.append(float(row['Vagas']));
                    taxa.append(float(row['Taxa Condomínio']));

        mediaPreco = np.mean(preco)
        mediaQuartos = np.mean(quartos)
        mediaSuites = np.mean(suites)
        mediaArea = np.mean(area)
        mediaVagas = np.mean(vagas)
        mediaTaxa = np.mean(taxa)

        varianciaPreco = np.var(preco)
        varianciaQuartos = np.var(quartos)
        varianciaSuites = np.var(suites)
        varianciaArea = np.var(area)
        varianciaVagas = np.var(vagas)
        varianciaTaxa = np.var(taxa)

        desvioPreco = np.sqrt(varianciaPreco)
        desvioQuartos = np.sqrt(varianciaQuartos)
        desvioSuites = np.sqrt(varianciaSuites)
        desvioArea = np.sqrt(varianciaArea)
        desvioVagas = np.sqrt(varianciaVagas)
        desvioTaxa = np.sqrt(varianciaTaxa)
        
        reader2 = csv.DictReader(open('C:/Users/Rodolfo/Documents/GitHub/sweethome-visualizacao-2017-1/Python/data/recife/anuncios-de-imoveis-recife-pe.csv', encoding="utf8"))

        for row in reader2:  

            
            if(len(row['Preço']) != 0 and
               len(row['Quartos']) != 0 and
               len(row['Suítes']) != 0 and
               len(row['Área Útil (m2)']) != 0 and
               len(row['Vagas']) != 0 and
               len(row['Taxa Condomínio']) != 0 and
               len(row['Latitude']) != 0 and
               len(row['Longitude']) != 0 and
               len(row['Tipo']) != 0 and
               float(row['Preço']) <= 2500000 and
               float(row['Quartos']) <= 4 and
               float(row['Suítes']) <= 4 and
               float(row['Área Útil (m2)']) <= 310 and
               float(row['Vagas']) <= 4 and
               float(row['Taxa Condomínio']) <= 1500 and
               float(row['Longitude']) < -33 and
               float(row['Longitude']) > -35 and
               float(row['Latitude']) < -7 and
               float(row['Latitude']) > -9 and
               row["Tipo"] == "Residencial" 
                    ):
                    row['Education'] = hits(row['Latitude'], row['Longitude'], 1000, 'Education')
                    row['Entertainment'] = hits(row['Latitude'], row['Longitude'], 1000, 'Entertainment')
                    row['Financial'] = hits(row['Latitude'], row['Longitude'], 1000, 'Financial')
                    row['Healthcare'] = hits(row['Latitude'], row['Longitude'], 1000, 'Healthcare')
                    row['Sustenance'] = hits(row['Latitude'], row['Longitude'], 1000, 'Sustenance')
                    row['Transportation'] = hits(row['Latitude'], row['Longitude'], 1000, 'Transportation')
                    writer.writerow(row)            
                        
