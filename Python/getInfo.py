import overpass
import geojson
import time

api = overpass.API()

city = input("Choose a city you want the info\n")

responseSustenance = api.Get("""
          area[name = "%s"]->.a; 
        (   
          node(area.a)[amenity~"bar|bbq|biergarten|cafe|drinking_water|fast_food|food_court|ice_cream|pub|restaurant"];
        )
          """ % city)
time.sleep(30);

responseEducation = api.Get("""
          area[name = "%s"]->.a; 
        (   
          node(area.a)[amenity~"college|kindergarten|library|public_bookcase|school|music_school|driving_school|language_school|university"];
        )
          """ % city)
time.sleep(30);

responseTransportation = api.Get("""
          area[name = "%s"]->.a; 
        (   
          node(area.a)[amenity~"bicycle_parking|bicycle_repair_station|bicycle_rental|boat_sharing|bus_station|car_rental|car_sharing|car_wash|charging_station|ferry_terminal|fuel|grit_bin|motorcycle_parking|parking|parking_entrance|parking_space|taxi"];
          node(area.a)[highway ~ bus_stop]; 
        )
          """ % city)
time.sleep(30);

responseFinancial = api.Get("""
          area[name = "%s"]->.a; 
        (   
          node(area.a)[amenity~"atm|bank|bureau_de_change"]; 
        )
          """ % city)
time.sleep(30);

responseHealthcare = api.Get("""
          area[name = "%s"]->.a; 
        (   
          node(area.a)[amenity~"baby_hatch|clinic|dentist|doctors|hospital|nursing_home|pharmacy|social_facility|veterinary|blood_donation"];
        )
          """ % city)
time.sleep(30);

responseEntertainment = api.Get("""
          area[name = "%s"]->.a; 
        (   
          node(area.a)[amenity~"arts_centre|brothel|casino|cinema|community_centre|fountain|gambling|nightclub|planetarium|social_centre|stripclub|studio|swingerclub|theatre"];
          node(area.a)[leisure];
        )
          """ % city)
time.sleep(30);

responseOthers = api.Get("""
          area[name = "%s"]->.a; 
        (   
          node(area.a)[amenity~"animal_boarding|animal_shelter|baking_oven|bench|clock|courthouse|coworking_space|crematorium|crypt|dive_centre|dojo|embassy|fire_station|game_feeding|grave_yard|hunting_stand|internet_cafe|kneipp_water_cure|marketplace|photo_booth|place_of_worship|police|post_box|post_office|prison|ranger_station|recycling|rescue_station|sanitary_dump_station|shelter|shower|table|telephone|toilets|townhall|vending_machine|waste_basket|waste_disposal|waste_transfer_station|watering_place|water_point"];
        )
          """ % city)

fileSustenance = '%sSustenance.geojson' % city
fileEducation = '%sEducation.geojson' % city
fileTransportation = '%sTransportation.geojson' % city
fileFinancial = '%sFinancial.geojson' % city
fileHealthcare = '%sHealthcare.geojson' % city
fileEntertainment = '%sEntertainment.geojson' % city
fileOthers = '%sOthers.geojson' % city


with open(fileSustenance, 'w') as outf:
    geojson.dump(responseSustenance, outf)
    
with open(fileEducation, 'w') as outf:
    geojson.dump(responseEducation, outf)

with open(fileTransportation, 'w') as outf:
    geojson.dump(responseTransportation, outf)

with open(fileFinancial, 'w') as outf:
    geojson.dump(responseFinancial, outf)

with open(fileHealthcare, 'w') as outf:
    geojson.dump(responseHealthcare, outf)

with open(fileEntertainment, 'w') as outf:
    geojson.dump(responseEntertainment, outf)

with open(fileOthers, 'w') as outf:
    geojson.dump(responseOthers, outf)
