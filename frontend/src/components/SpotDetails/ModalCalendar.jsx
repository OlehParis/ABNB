import './SpotDetails.css';
// import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useModal } from '../../context/Modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarModal({ onCheckInDateChange, onCheckOutDateChange }) {
    // const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [disabledDates, setDisabledDates] = useState([
        new Date(2024, 4, 10), // May 10, 2024
        new Date(2024, 4, 15), // May 15, 2024
        // Add more disabled dates as needed
    ]);


    const handleDateChange = (date) => {
        if (!checkInDate) {
            setCheckInDate(date);
            onCheckInDateChange(date)
        } else  {

            setCheckOutDate(date);
            onCheckOutDateChange(date)
        }
    };
    const handleClearDates = () => {
        setCheckInDate(null);
        setCheckOutDate(null);
    };
          // Function to check if a date is booked
          const handleTileDisabled = ({ date, view }) => {
            // Disable dates only for the month view
            if (view === 'month') {
                return disabledDates.some(disabledDate =>
                    date.getDate() === disabledDate.getDate() &&
                    date.getMonth() === disabledDate.getMonth() &&
                    date.getFullYear() === disabledDate.getFullYear()
                );
            }
            return false;
        };
 
        // const today = new Date();
        // const datesToCheck = [];
        
        // for (let i = 1; i <= 10; i++) {
        //     const nextDate = new Date(today);
        //     nextDate.setDate(today.getDate() + i);
        //     datesToCheck.push(nextDate);
        // }
        
        // console.log(datesToCheck);
        

    return (
        <div className="modal-calendar">
            <h3>Select check-in date</h3>
            <Calendar
                onChange={handleDateChange}
                value={checkInDate || checkOutDate } 
                selectRange={false}
                // selectRangeEnd={checkOutDate !== null} 
               tileDisabled={handleTileDisabled}
            />
            <button onClick={handleClearDates}>Clear Dates</button>
            <button onClick={closeModal}>Close</button>
        </div>
    );
}

export default CalendarModal;
