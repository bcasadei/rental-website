'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function QuantitySelector({
  onRent,
}: {
  onRent: (qty: number, startDate: Date | null, endDate: Date | null) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div>
      <div className='flex items-center mb-4'>
        <label htmlFor='quantity' className='mr-2 font-medium'>
          Quantity:
        </label>
        <input
          id='quantity'
          type='number'
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className='w-20 border rounded px-2 py-1 text-center'
        />
      </div>
      <div className='flex flex-col md:flex-row gap-4 mb-4'>
        <div>
          <label className='block font-medium mb-1'>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            className='border rounded px-2 py-1 w-full'
            placeholderText='Select start date'
          />
        </div>
        <div>
          <label className='block font-medium mb-1'>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || new Date()}
            className='border rounded px-2 py-1 w-full'
            placeholderText='Select end date'
          />
        </div>
      </div>
      <button
        className='w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-full shadow-md transition'
        onClick={() => onRent(quantity, startDate, endDate)}
        disabled={!startDate || !endDate}>
        Rent Now
      </button>
    </div>
  );
}
// This component allows users to select quantity and rental dates
// and triggers the onRent callback with the selected values.
// It uses react-datepicker for date selection and manages state with useState.
