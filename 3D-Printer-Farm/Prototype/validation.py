from flask import Flask
import random
from printerControl import Printer
import json
from emailLogic import SendEmail as em
import os

printer_details = [
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 1
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 2
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 3
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 4
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 5
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 6
]

printers = [Printer(ip, api_key) for ip, api_key in printer_details]

app = Flask(__name__)

# Link for accepting print request
# http://127.0.0.1:8000/validated/{code}
@app.route('/validated/<int:code>')
def validated(code):
    # fileDict.txt is 'storage' to store Email Credentials and GCodes temporarily until validated 
    # Reads fileDict.txt
    with open('fileDict.txt', 'r') as file:
        fileDict = json.load(file)
    # Check if code from URL is valid
    if str(code) not in fileDict:
        return f'<p>{code} not found</p>'
    printFile(code)                             # Send file to printer
    # Send Email to User
    email_receiver = fileDict[str(code)][2]     # Receiver's email address
    # Email Acceptance Body
    message = (
        f"Your GCode has been Accepted."
    )
    em(message, email_receiver) # SENDS ACCEPTANCE EMAIL
    
    os.remove(fileDict[str(code)][1])           # Remove file from local directory
    del fileDict[str(code)]                     # Remove code and file from file dictionary
    # Writes unto fileDict.txt
    with open('fileDict.txt', 'w') as file:
        json.dump(fileDict, file)
    return f'<p>Print request {code} validated</p>'

# Link for denying print request
# http://127.0.0.1:8000/denied/{code}
@app.route('/denied/<int:code>')

def denied(code):
    # Reads fileDict.txt
    with open('fileDict.txt', 'r') as file:
        fileDict = json.load(file)
    if str(code) not in fileDict:
        return f'<p>{code} not found</p>'
    # Send Email to User
    email_receiver = fileDict[str(code)][2]     # Receiver's email address
    # Email Denial Body
    message = (
        f"Your GCode has been denied. Go to the office for feedback."
    )
    em(message, email_receiver) # SENDS DENIAL EMAIL
    
    os.remove(fileDict[str(code)][1])           # Remove file from local directory
    del fileDict[str(code)]                     # Remove code and file from file dictionary
    print(fileDict)
    # Writes unto fileDict.txt
    with open('fileDict.txt', 'w') as file:
        json.dump(fileDict, file)
    return f'<p>Print request {code} denied</p>'

# Writes unto fileDict.txt
def addToFileDict(printer_choice, fileName, email_input):
    with open('fileDict.txt', 'r') as file:
        fileDict = json.load(file)
    while True:
        code = str(random.randint(1000000000, 9999999999))
        if code not in fileDict:
            fileDict[code] = [printer_choice, fileName, email_input]
            break
    with open('fileDict.txt', 'w') as file:
        json.dump(fileDict, file)
    return code

# Prints file in selected Printer
def printFile(code):
    # Reads fileDict.txt
    with open('fileDict.txt', 'r') as file:
        fileDict = json.load(file)
    printer_choice = fileDict[str(code)][0]                 # Grabs Printer integer number from 'storage'
    selected_printer = printers[printer_choice - 1]         # Grabs Printer object from 'storage'
    fileName = fileDict[str(code)][1]                       # Grabs GCode from 'storage'
    selected_printer.uploadCodeAndPrint(fileName)           # Uploads code and prints
    selected_printer.setInUse()                             # Sets Printer object to busy or not ready

if __name__ == '__main__':
    # Start website
    app.run(host='0.0.0.0', port=8000, debug=True)
