'use client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Separator } from '@/components/ui/separator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  PDFTable,
  TableFooter,
} from '@/components/ui/table';

import { fetchAllAttendance } from '@/lib/actions/attendance/fetch';
import wagesAction from '@/lib/actions/HR/wages/wagesAction';
import React, { useEffect, useState } from 'react';
import { FaWindows } from 'react-icons/fa6';
import WorkOrderHr from '@/lib/models/HR/workOrderHr.model';

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const [wagesData, setWagesData] = useState(null);

  const contentRef = React.useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `FormXVI/${searchParams.year}`,
  });
  const handleOnClick = async () => {
    if (!wagesData) {
      toast.error('Attendance data not available for Print generation.');
      return;
    }
    reactToPrintFn();
  };
  const handleDownloadPDF = async () => {
    if (!wagesData) {
      toast.error('Attendance data not available for PDF generation.');
      return;
    }

    await generatePDF(wagesData);
  };

  const generatePDF = async (attendanceData: any) => {
    const pdf = new jsPDF('l', 'pt', 'a4'); // Create a landscape PDF
    const ogId = `${searchParams.month}/${searchParams.year}`;

    // Create a container element to hold the content and table

    const originalElement = document.getElementById(ogId)!;
    const tableElement = originalElement.cloneNode(true) as HTMLElement;

    // Append the table to the container element

    tableElement.style.width = '1250px';

    const cells = tableElement.querySelectorAll('td, th');
    cells.forEach((cell: any) => {
      cell.style.padding = '8px'; // Adds padding to each cell
      cell.style.fontSize = '18px';
    });

    pdf.html(tableElement, {
      callback: async () => {
        pdf.save(`${ogId}.pdf`);
        const pdfDataUrl = pdf.output('dataurlstring');
      },
      x: 10,
      y: 10,
      html2canvas: { scale: 0.5 },
      autoPaging: 'text',
    });
  };

  useEffect(() => {
    const fn = async () => {
      try {
        setWagesData(null);
        const month = parseInt(searchParams.month);
        const workOrder = searchParams.wo;
        const Year = parseInt(searchParams.year);
        // console.log('shaiaiijsjs', data);
        // const filter = await JSON.stringify(data);

        const response = await wagesAction.FETCH.fetchFilledWages(
          month,
          Year,
          workOrder
        );
        //   console.log(JSON.parse(response.data))
        if (response?.success) {
          toast.success(response.message);
          const responseData = JSON.parse(response.data);
          const parsedData = responseData.map((item) => ({
            ...item, // Spread operator to copy existing properties
            otherCashDescription: JSON.parse(item.otherCashDescription),
            otherDeductionDescription: JSON.parse(
              item.otherDeductionDescription
            ),
          }));
          setWagesData(parsedData);

          console.log('aagya response', parsedData);
        } else {
          const errobj = await JSON.parse(response?.error);
          const mess = errobj.message ? errobj.message : 'Kya yaar';
          console.error('arrree muaa', JSON.parse(response?.error));
          console.error('arrree miiaa', mess);
          console.error('arrree minniaa', errobj);
          // console.error('arrree wuuuu', response.error);

          toast.error(response.message);
        }
      } catch (error) {
        toast.error('Internal Server Error');
        console.error('Internal Server Error:', error);
      }
    };
    fn();
  }, []);
  console.log('sahi h bhai');

  return (
    <div className='ml-[80px]'>
      <div className='flex gap-2 mb-2'>
        <Button onClick={handleDownloadPDF}>Download PDF</Button>
        <Button onClick={handleOnClick}>Print</Button>
      </div>

      <div id={`${searchParams.month}/${searchParams.year}`} ref={contentRef}>
        <div
          className='container left-0 right-0 bg-white overflow-hidden font-mono w-[1300px]'
          id='container-id'
        >
          <div className='px-2 py-6 text-center'>
            <h2 className='text-xl font-bold text-blue-700'>
              Allowance Receipt
            </h2>
            <p className='text-blue-600 font-bold mt-2'>
              [See rule 78 (2) (a)]
            </p>
            <h1 className='font-bold text-blue-600'>MUSTER ROLL</h1>
          </div>

          <div className='flex justify-between mx-0 font-bold'>
            <div className='flex flex-col'>
              <div className='flex gap-3 mb-4'>
                <div className='font-bold text-blue-600 max-w-64'>
                  Name and Address of Contractor:
                </div>
                <div>Sri construction and Co.</div>
              </div>
              <div className='flex gap-3 mb-4'>
                <div className='font-bold text-blue-600'>
                  Name and Location of work:
                </div>
                <div className='uppercase'>{searchParams?.location}</div>
              </div>
            </div>
            <div className='flex flex-col'>
              <div className='flex gap-3 mb-4'>
                <div className='font-bold text-blue-600 max-w-96'>
                  Name and Address of Establishment in/ under which Contract is
                  carried on:
                </div>
                <div className='uppercase'>{searchParams?.employer}</div>
              </div>
              <div className='flex gap-3 mb-4'>
                <div className='font-bold text-blue-600'>
                  Name and Address of Principal Employer:
                </div>
                <div className='uppercase'>{searchParams?.employer}</div>
              </div>
            </div>
          </div>

          <h1 className='font-bold mb-4 text-blue-600 text-center'>{`For the Month of ${searchParams.year}-0${searchParams.month}`}</h1>
        </div>
      </div>

      {wagesData && (
        <PDFTable className='border-2 border-black'>
          <TableHeader className='py-8 h-16 overflow-auto'>
            <TableRow>
              <TableHead
                className='text-black border-2 border-black'
                colSpan={2}
              ></TableHead>
              <TableHead
                className='text-black border-2 border-black text-center'
                colSpan={10}
              >
                Addition
              </TableHead>
              <TableHead
                className='text-black border-2 border-black'
                colSpan={1}
              ></TableHead>
            </TableRow>

            <TableRow className='text-black h-28'>
              <TableHead className='text-black border-2 border-black'>
                Sl No.
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Employee Name
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                HRA
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Monthly Mobile Allowance
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Monthly Incumbent Allowance
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Earned Other Cash
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Performance Bonus
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Washing Allowance
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Conveyance Allowance
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Medical Allowance
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Site Specific Allowance
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Other Allowance
              </TableHead>
              <TableHead className='text-black border-2 border-black'>
                Grand Total
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {wagesData.map((employee, index) => (
              <TableRow key={employee._id} className='h-16'>
                <TableCell className='border-black border-2 text-black'>
                  {index + 1}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {employee.employee?.name}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.hra).toFixed(2)}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.mob).toFixed(2)}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.incumb).toFixed(2)}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.eoc).toFixed(2)}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.pb).toFixed(2)}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.wa).toFixed(2)}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.ca).toFixed(2)}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.ma).toFixed(2)}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.ssa).toFixed(2)}
                </TableCell>
                <TableCell className='border-black border-2 text-black'>
                  {(employee.otherCashDescription?.oa).toFixed(2)}
                </TableCell>

                <TableCell className='border-black border-2 text-black'>
                  {(
                    employee.otherCashDescription?.hra +
                    employee.otherCashDescription?.mob +
                    employee.otherCashDescription?.incumb +
                    employee.otherCashDescription?.eoc +
                    employee.otherCashDescription?.pb +
                    employee.otherCashDescription?.wa +
                    employee.otherCashDescription?.ca +
                    employee.otherCashDescription?.ma +
                    employee.otherCashDescription?.ssa +
                    employee.otherCashDescription?.oa
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className='border-black border-2 text-black'>
              <TableCell className='border-black border-2 text-black'>
                Total
              </TableCell>
              <TableCell className='border-black border-2 text-black'></TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.hra || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.mob || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.incumb || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.eoc || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.pb || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.wa || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.ca || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.ma || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.ssa || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum + (employee.otherCashDescription?.oa || 0),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
              <TableCell className='border-black border-2 text-black'>
                {wagesData
                  .reduce(
                    (sum, employee) =>
                      sum +
                      (employee.otherCashDescription?.hra +
                        employee.otherCashDescription?.mob +
                        employee.otherCashDescription?.incumb +
                        employee.otherCashDescription?.eoc +
                        employee.otherCashDescription?.pb +
                        employee.otherCashDescription?.wa +
                        employee.otherCashDescription?.ca +
                        employee.otherCashDescription?.ma +
                        employee.otherCashDescription?.ssa +
                        employee.otherCashDescription?.oa),
                    0
                  )
                  .toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </PDFTable>
      )}

      {!wagesData && <div className='text-red'>No wages data available</div>}
    </div>
  );
};
export default Page;
