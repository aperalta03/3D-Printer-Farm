import re



class GCode:
    ### CONSTRUCTOR ###
    def __init__(self, filename):
        self.f_gcode = open(filename, 'r')
        self.data = self.f_gcode.read()

    ### DECONSTRUCTOR ###
    def __del__(self):
        self.f_gcode.close()

    ### FILAMENT COST ###
    def get_filament_cost(self):
        re_value = re.search(r'total filament cost = ([0-9.]+)', self.data)
        if re_value:
            value = float(re_value.group(1))
        else:
            print('data not found')
            value = None
        return value

    ### FILAMENT USED ###
    def get_filament_used(self):
        re_value = re.search(r'filament used \[g\] = ([0-9.]+)', self.data)
        if re_value:
            value = float(re_value.group(1))
        else:
            print('data not found')
            value = None
        return value

    ### SUPPORT MATERIAL ###
    def get_support_material(self):
        re_value = re.search(r'support_material = ([0-9.]+)', self.data)
        if re_value:
            value = float(re_value.group(1))
        else:
            print('data not found')
            value = None
        return value

    ### FILAMENT COLOUR ###
    def get_colour(self):
        re_value = re.search(r'filament_colour = #([0-9a-fA-F]+)', self.data)
        if re_value:
            value = re_value.group(1)
        else:
            print('data not found')
            value = None
        return value

    ### FILAMENT TYPE ###
    def get_filament_type(self):
        re_value = re.search(r'filament_type = (.+)', self.data)
        re_value1 = re.search(r'filament_vendor = (.+)',self.data)
        if re_value and re_value1:
            value = re_value.group(1) + " "+re_value1.group(1)
        else:
            print('data not found')
            value = None
        return value

    ### PRINTING TIME ###
    def get_printing_time(self):
        re_value = re.search(r'estimated printing time \(normal mode\) = (.+)', self.data)
        if re_value:
            value = re_value.group(1)
        else:
            print('data not found')
            value = None
        return value

    ### INFILL PERCENTAGE ###
    def get_infill(self):
        re_value = re.search(r'fill_density = (.+)', self.data)
        if re_value:
            value = re_value.group(1)
        else:
            print('data not found')
            value = None
        return value
    
    def get_settings(self):
        default_values = {
            "0.10mm FAST DETAIL @MK4IS 0.4",
            "0.15mm SPEED @MK4IS 0.4",
            "0.15mm STRUCTURAL @MK4IS 0.4",
            "0.20mm SPEED @MK4IS 0.4",
            "0.20mm STRUCTURAL @MK4IS 0.4"
        }
        re_value = re.search(r'default_print_profile = (.+)', self.data).group(1)
        response = ""
        defInfill = True
        if self.get_infill() != "15%":
            defInfill = False
        if (re_value in default_values) & (defInfill):
            response = (f"The print is using on of the 5 default presets. It is using {re_value}.")
        else:
            response = (f"The print is NOT using one of the 5 default presets. It is using {re_value}. ")
        return response
    
    ### SUPPORTS ###
    def get_supports(self):
        re_value = re.search(r'support_material = (.+)', self.data)
        if re_value:
            value = (re_value.group(1) != "0")
        else:
            print('data not found')
            value = None
        return value
    
    ### THUMBNAIL ###
    def extract_gcode_thumbnail(self):
        inImage = False
        image = ""
        lines = self.data.split("\n")
        for line in lines:
            if "thumbnail end" in line:
                inImage = False
            if inImage:
                image += line
            if "thumbnail begin" in line:
                inImage = True
                image = ""
        return image.strip().replace('; ', '').replace('\n', '')

if __name__ == "__main__":
    g = GCode('gcode/struct.gcode')
    # print("Filament Cost: $"+str(g.get_filament_cost()))
    # print("Filament Used: "+str(g.get_filament_used())+" g used")
    # print("Support Filament: "+str(g.get_support_material())+" g used")
    # print("Filament Color: #"+str(g.get_colour()))
    # print("Filament Type: "+str(g.get_filament_type()))
    # print("Estimated Printing Time: "+str(g.get_printing_time()))
    # print(g.get_settings())
    # print("Infill: "+g.get_infill())
    # print("Supports: "+str(g.get_supports()))
    print("Thumbnail: "+g.extract_gcode_thumbnail())
    # print("Fillament: "+(g.get_filament_type()))
