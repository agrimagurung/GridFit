import sys
import serial
import time
from pymongo import MongoClient
from datetime import datetime, timezone
import uuid

# Configuration
SERIAL_PORT = 'COM3'
BAUD_RATE = 115200
RESISTOR_OHMS = 0.10
SAMPLE_INTERVAL = 5  # seconds

# MongoDB Setup
client = MongoClient('mongodb+srv://adri-ayala:Pickles254@gridfit.szhbvt2.mongodb.net/?retryWrites=true&w=majority&appName=GridFit')
db = client['GridFit']
readings_collection = db['Session']
summary_collection = db['UserStats']

def parse_voltage(raw_data):
    try:
        return float(raw_data.strip())
    except ValueError:
        return None

def main():
    if len(sys.argv) < 2:
        print("Error: Student ID is required")
        sys.exit(1)

    student_id = sys.argv[1]  # Get the Student ID from the command-line arguments
    session_id = str(uuid.uuid4())
    print(f"Starting session for Student ID: {student_id}, Session ID: {session_id}")

    try:
        try:
            ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
            print(f"Connected to DAQ on {SERIAL_PORT}...")
        except serial.SerialException as e:
            print(f"Error: Could not open serial port {SERIAL_PORT}. {e}")
            sys.exit(1)

        session_data = []
        start_time = datetime.now(timezone.utc)

        while True:
            raw_data = ser.readline().decode('utf-8')
            voltage = parse_voltage(raw_data)

            if voltage is not None:
                current = voltage / RESISTOR_OHMS
                power = voltage * current
                timestamp = datetime.now(timezone.utc)

                data_point = {
                    "student_id": student_id,
                    "session_id": session_id,
                    "timestamp": timestamp,
                    "voltage_V": voltage,
                    "current_A": current,
                    "power_W": power
                }
                readings_collection.insert_one(data_point)
                session_data.append((timestamp, power))

                print(f"[{timestamp}] V: {voltage:.3f} | I: {current:.3f} | P: {power:.3f}")
            else:
                print("Invalid data received:", raw_data.strip())

            time.sleep(SAMPLE_INTERVAL)

    except KeyboardInterrupt:
        print("\nSession ended. Calculating summary...")

        end_time = datetime.now(timezone.utc)
        duration_sec = (end_time - start_time).total_seconds()
        powers = [p for _, p in session_data]
        energy_Wh = sum(p * SAMPLE_INTERVAL for p in powers) / 3600  # W * sec -> Wh
        average_power = sum(powers) / len(powers) if powers else 0
        peak_power = max(powers) if powers else 0

        summary_doc = {
            "student_id": student_id,
            "session_id": session_id,
            "start_time": start_time,
            "end_time": end_time,
            "duration_sec": duration_sec,
            "num_samples": len(session_data),
            "total_energy_Wh": energy_Wh,
            "average_power_W": average_power,
            "peak_power_W": peak_power
        }

        summary_collection.insert_one(summary_doc)
        print("Session summary stored in 'UserStats'.")
        print(summary_doc)

    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()

if __name__ == "__main__":
    main()