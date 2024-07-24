import PrusaLinkPy
import time

def uploadAndPrint(IP, API, gcode):
    try:
        access = PrusaLinkPy.PrusaLinkPy(IP, API)
        printer = access.get_printer()
        available = True 
        print("Successfully connected.")
    except Exception as e:
        print("Failed to connect.")
        return

    if not access.exists_gcode(gcode):
        access.put_gcode(gcode, gcode)  # Upload code
        while not access.exists_gcode(gcode):  # wait until finished uploading, and print once done uploading
            time.sleep(5)
            print("Uploading...")
        print("printing gcode...")
        access.post_print_gcode("/usb/" + gcode)  # Print code
