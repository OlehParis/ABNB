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
 console.log(checkInDate, 'checkin')
 console.log(checkOutDate , 'checkout')
    return (
        <div className="modal-calendar">
            <h3>Select check-in date</h3>
            <Calendar
                onChange={handleDateChange}
                value={checkInDate || checkOutDate } 
                selectRange={false}
                // selectRangeEnd={checkOutDate !== null} 
            />
            <button onClick={handleClearDates}>Clear Dates</button>
            <button onClick={closeModal}>Close</button>
        </div>
    );
}

export default CalendarModal;
