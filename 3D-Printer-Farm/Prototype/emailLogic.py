import smtplib

##### SENDS EMAIL #####
def SendEmail(body, email_receiver):
    subject = "3D Printing Validation"                                  # Email Subject
    smtp_server = "smtp.openhub.be"                                     # SMTP Server - DNT
    smtp_port = 587    
    email_sender = '3dprinters@openhub.be'                              # Sender's email address
    email_password = '###########'                                      # Sender's email password
    text = f"Subject: {subject}\n\n{body}"                              # Email Body 
    server = smtplib.SMTP(smtp_server, smtp_port)                       # Starting server to send email
    server.starttls() 
    try:
        server.login(email_sender, email_password)                      # Logs in email account to send email
        server.sendmail(email_sender, email_receiver, text)             # Sends email
        print("Email has been sent to " + email_receiver)               # Prints status message
    except Exception as e:
        print(f"Failed to send email: {e}")                             # Exception if email fails
    finally:
        server.quit()                                                   # Closes down server once email is sent