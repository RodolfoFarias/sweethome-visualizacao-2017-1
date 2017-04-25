import overpy

api = overpy.Overpass()

result = api.query("""
    [out:xml];
    area[name = "Caruaru"]->.a; 
        (   
          node(area.a)[amenity];
          node(area.a)[highway = bus_stop]; 
        ); 
    out; 
    """)


for node in result.nodes:
    print("Name: %s" % node.tags.get("name"))
