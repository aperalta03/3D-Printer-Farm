
Project: OpenHubPrinting

Authors: Adam Hussain, Alonzo Peralta, Brayden Donovan


gcodeScraper.py
    collects data from gcode files

    functions:
        get_filament_cost
            parameters: data string from gcode file
            returns: filament cost in euros

        get_filament_used
            parameters: data string from gcode file
            returns: filament used in grams

        get_support_material
            parameters: data string from gcode file
            returns: amount of support material required for print

        get_colour
            parameters: data string from gcode file
            returns: colour of filament

        get_filament_type
            parameters: data string from gcode file
            returns: type of filament

        get_printing_time
            parameters: data string from gcode file
            returns: estimated printing time


printerControl.py
    controls printer functionality

    Printer class
        parameters:
            IP: IP address of printer
            key: PrusaLink API key
        
        Printer functions:
            startPrint
                parameters: gcode file to print
            
            getBedTemp
                returns: printer bed temperature
            
            getNozzleTemp
                returns: printer nozzle temperature

            getState
                returns: what the printer is currently doing: Printing, Operational, etc.
            
            isReady
                returns: if the printer is ready to print
            
            getMaterial
                returns: type of filament in the printer
            

website.py

    idk