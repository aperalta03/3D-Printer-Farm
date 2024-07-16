import PrusaLinkPy
import time

#PRINTER CLASS
class Printer:
    # BASIC
    def __init__(self, IP, key):
        try:
            self.access = PrusaLinkPy.PrusaLinkPy(IP, key)
            self.printer = self.access.get_printer()
            self.available = True 
            self.color = "Orange" #orange is default
            print("Successfully connected.")
        except Exception as e:
            print("Failed to connect.")
            
    def startPrint(self,gcode):
        self.access.post_print_gcode("/usb/"+gcode) # Print code
    
    def uploadCode(self,gcode):
        self.access.put_gcode(gcode, gcode) # Upload code
        
    def uploadCodeAndPrint(self,gcode):
        if not self.access.exists_gcode(gcode):  #checks that gcode isnt already on USB
            self.access.put_gcode(gcode, gcode) # if not, upload code
            while not (self.access.exists_gcode(gcode)): # wait until finished uploading, and print once done uploading
                time.sleep(5)
        print("printing gcode...")
        self.startPrint(gcode) # start the print
        
    # DATA
    def getBedTemp(self):
        return self.printer.json()["telemetry"]["temp-bed"]
    
    def getNozzleTemp(self):
        return self.printer.json()["telemetry"]["temp-nozzle"]
       
    def getState(self):
        return self.printer.json()["state"]["text"]
    
    def isReady(self): # returns if the printer can be used at the given time or not
        return (self.printer.json()["state"]["flags"]["ready"] & self.getAvailable())
    
    def getMaterial(self):
        return self.printer.json()["telemetry"]["material"]
    
    def getColor(self):
        return self.color

    def setColor(self,newColor):
        self.color = newColor
    
    # CONTROL
    def setInUse(self): # should be set in use when a printer starts
        self.available = False
        
    def setNotInUse(self): # should be set not in use when the user removes the object from printer
        self.available = True
         
    def getAvailable(self):
        return self.available
    
#TESTING
# if __name__ == '__main__':
#     print("Connecting to printer") 
#     prusa4k = Printer("192.168.0.72", "qhMbfVpFnjRbvm5")
#     prusa4k.setNotInUse()
#     print("Posting state")
#     print(prusa4k.isReady())
#     print("Uploading gcode")
#     gcode = "pikachu_0.4n_0.2mm_PLA_MK4_25m.gcode"
#     prusa4k.uploadCodeAndPrint(gcode)
#     time.sleep(2)
#     print(prusa4k.isReady())
