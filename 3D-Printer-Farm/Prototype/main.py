import streamlit as st
from printerControl import Printer
from gcodeScraper import GCode
from datetime import datetime
import smtplib
from io import StringIO
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import base64
from streamlit_navigation_bar import st_navbar
from validation import addToFileDict
import os

##### EMAIL Credentials #####
email_sender = '3dprinters@openhub.be'          # Sender's email address
email_password = '###########'                  # Sender's email password
email_receiver = '3dprinters@openhub.be'        # Receiver's email address

subject = "3D Printing Validation"              # Email Subject
smtp_server = "smtp.openhub.be"                 # SMTP Server
smtp_port = 587                                 # SMTP Port

##### (IP, API) - Printers #####
printer_details = [
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 1
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 2
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 3
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 4
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 5
    ("192.168.0.72", "qhMbfVpFnjRbvm5"), # Printer 6
]

printers = [Printer(ip, api_key) for ip, api_key in printer_details]    # Initialize Printer Objects

##### DISPLAYS Printer List #####
def display_printer_info(printer, printer_number):
    st.markdown(f"### Printer {printer_number}:")                       # Printer Number
    status = "Ready" if printer.isReady() else "Not Ready"
    st.markdown(f"**Status:** {status}") #If it is ready or not
    st.markdown(f"**Material:** {printer.getMaterial()}")               # The filament material
    st.markdown(f"**Color:** {printer.getColor()}")

##### SENDS EMAIL #####
def SendEmail(printers, printer_choice, file, fileData, code, userEmail):
    cost = str(fileData.get_filament_cost())                            # Get Cost of Filament from GCode - fileData
    estimated_time = str(fileData.get_printing_time())                  # Get Print Time from GCode - fileData
    filament_type = fileData.get_filament_type()                        # get Filament type
    infill = fileData.get_infill()                                      # get infill amount
    settings = fileData.get_settings()                                  # get sitting preset
    supports = fileData.get_supports()                                  # get supports bool value
    support_sent = ""
    if(supports):
        support_sent = "The user IS using supports."
    else:
        support_sent = "The user is not using supports."
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")                  # Get DateTime
    
    # Creates Thumbnail in Local Directory
    binary_png_data = str.encode(fileData.extract_gcode_thumbnail())    # Encoding GCode Thumbnail Code
    with open("gcodeimage.png", "wb") as fh:                            # Pasting the Code into a temp .png file
        fh.write(base64.decodebytes(binary_png_data))                   # Decoding the 64 based encryption for GCode thumbnail

    # Email Body:
    message = MIMEMultipart()
    message_text = (
        f"A user has requested to print to printer {str(printer_choice)} at {now}. \n"
        f"  -It will cost {cost} Euros. It will take {estimated_time}. \n"
        f"  -The user has requested the filament type: {filament_type}.\n"
        f"  -They have set {infill} infill. \n"
        f"  -{support_sent}\n"
        f"  -{settings}\n"
        f"  -It is called: {file.name}.\n" 
        f"  -The users email is {userEmail}.\n"
        f"\n"
        f"To validate this print request click this link: http://127.0.0.1:8000/validated/{code}\n"
        f"To deny this print request click this link: http://127.0.0.1:8000/denied/{code}"
    )
    message.attach(MIMEText(message_text, "plain")) # Attaching Image to Email

    # Attach thumbnail to email body
    with open("gcodeimage.png", "rb") as fh:
        attachment_data = fh.read()
    attachment = MIMEImage(attachment_data)
    # Attachment Title
    attachment.add_header(
        'Content-Disposition', 'attachment', filename="gcodeimage.png"
    )
    # Attaching   
    message.attach(attachment)
    os.remove("gcodeimage.png") # delete image
    # os.remove()
    # Setting up message to be sent as an email
    message['Subject'] = subject
    message['From'] = email_sender
    message['To'] = email_receiver
    
    server = smtplib.SMTP(smtp_server, smtp_port)                       # Starting server to send email
    server.starttls()
    try:
        server.login(email_sender, email_password)                      # Logs in email account to send email
        server.sendmail(email_sender, email_receiver, message.as_string())             # Sends email
        print("Email has been sent to " + email_receiver)               # Prints status message
    except Exception as e:
        print(f"Failed to send email: {e}")                             # Exception if email fails
    finally:
        server.quit()                                                   # Closes down server once email is sent

def main():
    # Navigation Bar
    page = st_navbar(["Uploading Dock", "Printer Farm"])
    
    # Checks for button pressing
    if "selected_printer" not in st.session_state:                                                                                                      
        st.session_state.selected_printer = None
    
    # First Page    
    if page == "Uploading Dock":
        st.header("Openhub Printers:") # Header
        # Loop through and display info for each printer
        for idx, printer in enumerate(printers, start = 1):
            display_printer_info(printer, idx)
            
        uploaded_file = st.file_uploader("Upload GCode here (only .gcode files are accepted.):") # Input GCode
        email_input = st.text_input(f"Enter Email, then hit enter")            # Input Email
        
        if uploaded_file is None: # If GCode is null
            st.markdown("Cost: N/A")
            st.markdown("Estimated Time: N/A")
        else: # If NOT
            # Save Uploaded File to Local Directory
            stringio = StringIO(uploaded_file.getvalue().decode("utf-8"))        # Convert the Uploaded File into a String Based IO
            string_data = stringio.read()                                        # Convert the String Based IO into a String
            f = open(uploaded_file.name, 'w')                                    # Create a Local File with the Name of the Uploaded File
            f.write(string_data)                                                 # Write the Contents of the Uploaded File to the Local File
            f.close()                                                            # Close the write version of the local file so that it can be read by the GCode Class
            # Process the uploaded file
            gCodeData = GCode(uploaded_file.name)                                # Making a GCode Object from gcodeScraper.py 
            cost = gCodeData.get_filament_cost()                                 # Getting Filament Cost
            estimated_time = gCodeData.get_printing_time()                       # Getting Printing Time
            # Return to the user these variables
            st.markdown(f"Cost: {cost}")                                         # Printing Cost
            st.markdown(f"Estimated Time: {estimated_time}")                     # Printing Estimated Time
            # Dropdown Menu for Printer Choice
            printer_choice = st.selectbox("Please select the printer you would like to use (1-6): Once you hit submit, a validator will either deny or accept your project.", range(1, len(printers) + 1))

            # Submit Button - GCODE UPLOAD
            if st.button("Submit"): # If Button Pressed
                # Validate the printer choice and start the print
                selected_printer = printers[printer_choice - 1]                                                 # Selects the printer chosen by User
                code = addToFileDict(printer_choice, uploaded_file.name, email_input)                           # Saves the selected printer ID and file name to the dictionary
                if selected_printer.isReady():                                                                  # Checks if Printer is Ready
                    selected_printer.uploadCode(uploaded_file.name)                                             # Uploads Code and Saves Code - Printer Control Function
                    st.markdown(f"GCode file has been uploaded.")                                               # Allow user to input their own email
                    SendEmail(printer_details, printer_choice, uploaded_file, gCodeData, code, email_input)     # Runs Method to Process Data and Send Email
                else:
                    st.markdown(f"Printer {printer_choice} is not ready.")
    
    # Second Page
    elif page == "Printer Farm":
        st.header("Manage Printers") # Title of Page
        for idx, printer in enumerate(printers, start=1):                                                       # List all printers
            status = "Ready" if printer.isReady() else "Not Ready"                                              # If status is ready
            color = "green" if status == "Ready" else "red"                                                     
            with st.expander(f"Manage Printer {idx}", expanded=st.session_state.selected_printer == idx):       # Dropdown menu of all details per printer
                st.markdown(f"## Printer {idx} Details")                                                        # 
                st.markdown(f"**Status:** {status}")
                st.markdown(f"**Material:** {printer.getMaterial()}")
                st.markdown(f"**Color:** {printer.getColor()}")
                
                # Allow user the enter the color
                color_input = st.text_input(f"Enter Filament Color for Printer {idx} (Hit enter once the color is written. Then Hit Set Filament Color)")
                if st.button(f"Set Filament Color {idx}"):
                    if color_input:
                        printer.setColor(color_input) # Set color on printer information
                        st.success(f"Filament color set to {color_input} for Printer {idx}") # Set color on website
                    else:
                        st.error("Please enter a color.")
                    pass
                if st.button(f"Set Printer Ready {idx}"):
                    printer.setNotInUse() # Set varibale accsessable to True
                    st.success(f"Printer {idx} is no longer marked in use.")
                    pass
                
if __name__ == "__main__":
    main()
