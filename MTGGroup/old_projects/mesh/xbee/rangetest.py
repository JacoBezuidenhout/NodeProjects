import serial
import binascii
import time

ser = serial.Serial("COM2",9600);

while True:
	tmp = "7E 00 04 08 C2 44 42 AF 7E 00 0F 17 C3 00 13 A2 00 40 BD D4 6C FF FE 02 44 42 AE".replace(" ","");
	print "#######################################################################################"		
	print tmp			
	print binascii.unhexlify(tmp)		
	print "#######################################################################################"
	ser.write(binascii.unhexlify(tmp))
	time.sleep(2)	

	tmp = '';
	while ser.inWaiting() > 0:
		r = ser.read();
		tmp = ""
		if '7e' in r :
			tmp += ser.read().encode("hex")
			print tmp
	time.sleep(0.1)
ser.close()