import fs from 'fs';
import base64 from 'base-64';

class GCode {
    constructor(filename) {
        this.data = fs.readFileSync(filename, 'utf-8');
    }

    getFilamentCost() {
        const match = this.data.match(/total filament cost = ([0-9.]+)/);
        return match ? parseFloat(match[1]) : null;
    }

    getFilamentUsed() {
        const match = this.data.match(/filament used \[g\] = ([0-9.]+)/);
        return match ? parseFloat(match[1]) : null;
    }

    getSupportMaterial() {
        const match = this.data.match(/support_material = ([0-9.]+)/);
        return match ? parseFloat(match[1]) : null;
    }

    getColour() {
        const match = this.data.match(/filament_colour = #([0-9a-fA-F]+)/);
        return match ? match[1] : null;
    }

    getFilamentType() {
        const match = this.data.match(/filament_type = (.+)/);
        const vendorMatch = this.data.match(/filament_vendor = (.+)/);
        return match && vendorMatch ? `${match[1]} ${vendorMatch[1]}` : null;
    }

    getPrintingTime() {
        const match = this.data.match(/estimated printing time \(normal mode\) = (.+)/);
        return match ? match[1] : null;
    }

    getInfill() {
        const match = this.data.match(/fill_density = (.+)/);
        return match ? match[1] : null;
    }

    getSettings() {
        const defaultValues = [
            "0.10mm FAST DETAIL @MK4IS 0.4",
            "0.15mm SPEED @MK4IS 0.4",
            "0.15mm STRUCTURAL @MK4IS 0.4",
            "0.20mm SPEED @MK4IS 0.4",
            "0.20mm STRUCTURAL @MK4IS 0.4"
        ];
        const match = this.data.match(/default_print_profile = (.+)/);
        const reValue = match ? match[1] : "";
        const response = defaultValues.includes(reValue) && this.getInfill() === "15%" ?
            `The print is using one of the 5 default presets. It is using ${reValue}.` :
            `The print is NOT using one of the 5 default presets. It is using ${reValue}.`;
        return response;
    }

    getSupports() {
        const match = this.data.match(/support_material = (.+)/);
        return match ? match[1] !== "0" : null;
    }

    extractGCodeThumbnail() {
        let inImage = false;
        let image = "";
        const lines = this.data.split("\n");
        for (const line of lines) {
            if (line.includes("thumbnail end")) inImage = false;
            if (inImage) image += line;
            if (line.includes("thumbnail begin")) {
                inImage = true;
                image = "";
            }
        }
        return image.trim().replace(/; /g, '').replace(/\n/g, '');
    }
}

export default GCode;
