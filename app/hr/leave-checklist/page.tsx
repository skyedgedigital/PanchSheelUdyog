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
} from '@/components/ui/table';
import wagesAction from '@/lib/actions/HR/wages/wagesAction';

import React, { useEffect, useState } from 'react';

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const [leaveData, setLeaveData] = useState(null);

  const [totalEL, setTotalEL] = useState(0);
  const [totalCL, setTotalCL] = useState(0);
  const [totalFL, setTotalFL] = useState(0);
  const [total, setTotal] = useState(0);

  const contentRef = React.useRef(null);
 const reactToPrintFn = useReactToPrint({ contentRef,
  documentTitle:`BonusStatement/${searchParams.year}`, })
 const handleOnClick = React.useCallback(() => {
  reactToPrintFn();
}, [reactToPrintFn]);

  const handleDownloadPDF = async () => {
    if (!leaveData) {
      toast.error('Attendance data not available for PDF generation.');
      return;
    }

    await generatePDF(leaveData);
  };


  useEffect(() => {
    if (leaveData && leaveData.length > 0) {
      // Step 2: Calculate sums using reduce
      const totalAttendance = leaveData.reduce(
        (acc, employee) => acc + employee.EL, 
        0
      );
      const totalNetAmountPaid = leaveData.reduce(
        (acc, employee) => acc + employee.CL, 
        0
      );
      const totalBonus = leaveData.reduce(
        (acc, employee) => acc + employee.FL, 
        0
      );
      const totall = leaveData.reduce(
        (acc, employee) => acc + employee.tot, 
        0
      );
      // Step 3: Update state with the calculated sums
      setTotalEL(totalAttendance);
      setTotalCL(totalNetAmountPaid);
      setTotalFL(totalBonus);
      setTotal(totall)
    }
  }, [leaveData]);

  const generatePDF = async (leaveData) => {
    const pdf = new jsPDF('l', 'pt', 'a4'); // Create a landscape PDF
    const ogId = `Leave-checklist/${searchParams.year}`;
    console.log('searched params', searchParams);

    // Create a container element to hold the content and table

    const originalElement = document.getElementById(ogId)!;
    const tableElement = originalElement.cloneNode(true) as HTMLElement;

    // Append the table to the container element

    tableElement.style.width = '1250px';

    pdf.html(tableElement, {
      callback: async () => {
        pdf.save(`${ogId}.pdf`);
        const pdfDataUrl = pdf.output('dataurlstring');
      },
      x: 10,
      y: 10,
      html2canvas: { scale: 0.6 },
      autoPaging: 'text',
    });
  };

  useEffect(() => {
    const fn = async () => {
      try {
        setLeaveData(null);
        const data = {
          // @ts-ignore
          year: parseInt(searchParams.year),
          workOrder:searchParams.wo

        };
        console.log('shaiaiijsjs', data);
        const filter = await JSON.stringify(data);

        const response = await wagesAction.FETCH.fetchWagesForCalendarYear(
          filter
        );
        //   console.log(JSON.parse(response.data))
        const responseData = JSON.parse(response.data);
        setLeaveData(responseData);
        console.log('response aagya bawa', responseData);
        console.log('aagya response');
      } catch (error) {
        toast.error('Internal Server Error');
        console.log('Internal Server Error:', error);
      }
    };
    fn();
  }, []);
  console.log('sahi h bhai');

  const days = Array.from({ length: 31 }, (_, i) => i + 1); // Array of days (1 to 31)
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];
  const months2 = [1,2,3,4,5,6,7,8,9,10,11,12]

  return (
    <div className='ml-[80px]'>
     
     <div className='flex gap-2 mb-2'>
      <Button onClick={handleDownloadPDF}>Download PDF</Button>
      <Button onClick={handleOnClick}>Print</Button>
      </div>

      <div
        id={`Leave-checklist/${searchParams.year}`}
        className='flex flex-col gap-4'
        ref={contentRef}
      >
        
        <div
          className='container left-0 right-0  overflow-hidden font-mono w-full border-[1px] border-gray-900 pb-4'
          id='container-id'
        >

          <div className='px-2 py-6 text-center  '>
            <h1 className='text-xl  underline  uppercase font-bold'>muster roll</h1>
          </div>
          <div className='flex justify-between w-full gap-6 text-sm ml-0 mr-20  '>
            <div className='flex flex-col flex-1'>
              <div className='flex gap-3 mb-4 '>
                <div className=' max-w-64 uppercase'>
                  Panchsheel Udyog House No 78 kapli near hari mandir,
                  po kapali saraikea, kharsawn jharkhand
                </div>
                <div></div>
              </div>
            
            </div>
            <div className='flex flex-1 gap-4'>
              <div className='flex gap-3 mb-4'>
                <div className=' max-w-96 '>Leave Register</div>
                <div className=''>From</div>

                <div>{`01-01-${searchParams.year}`}</div>
              </div>
              <div className='flex gap-3 mb-4'>
                <div className=''>To</div>
                <div>{`31-12-${searchParams.year}`}</div>
              </div>
            </div>
            <div className='flex flex-col flex-1'>
                <div className=' text-right mb-2'>
                  Name and Address of the Contractor In under which Establishment
                  is carried on
                </div>
                <div className='text-right'>Tata Steel UISL</div>
             
                <div className='text-right'>
                  Name and Address of Principal Employer
                </div>
           
            </div>
          </div>
          <div className='flex justify-between '>
            <div>Nature and Location of work</div>
            <div>{searchParams.wog}</div>
          </div>
        </div>

        {leaveData && (
          <PDFTable className='border-[1px] border-black font-mono '>
            <TableHeader className=' py-8 h-16 overflow-auto border-[1px] border-black]  '>
              <TableRow className='text-black h-28 '>
                <TableHead className=' text-black border-[1px] border-black'>
                  Sl No.
                </TableHead>

                <TableHead className=' text-black border-[1px] border-black'>
                  Employee Name
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Father&apos;s name
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Sex
                </TableHead>
                {/* Table headers for each day */}

                <TableHead className=' text-black border-[1px] border-black'>
                  Jan
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Feb
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Mar
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Apr
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  May
                </TableHead>

                <TableHead className=' text-black border-[1px] border-black'>
                  Jun
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Jul
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Aug
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Sep
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Oct
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Nov
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Dec
                </TableHead>

                <TableHead className=' text-black border-[1px] border-black'>
                  Total Attendance
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  EL
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  CL
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  FL
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Total
                </TableHead>
                <TableHead className=' text-black border-[1px] border-black'>
                  Remarks
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveData.map((employee, index) => {
                const aggregatedWages = employee.wages.reduce((acc, wage) => {
                  if (acc[wage.month]) {
                    acc[wage.month].attendance += wage.attendance;
                    acc[wage.month].netAmountPaid += wage.netAmountPaid;
                  } else {
                    acc[wage.month] = {
                      attendance: wage.attendance,
                      netAmountPaid: wage.netAmountPaid,
                    };
                  }
                  return acc;
                }, {});
                return(
                <TableRow key={employee._id} className='h-16'>
                  <TableCell className='border-black border-[1px] text-black'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='border-black border-[1px] text-black'>
                    {employee.employee.name}
                  </TableCell>
                  <TableCell className='border-black border-[1px] text-black'>
                    {employee.employee.fathersName}
                  </TableCell>
                  <TableCell className='border-black border-[1px] text-black'>
                    {employee.employee.sex}
                  </TableCell>
                  {/* Table data for each day (status) */}
                  {months2.map((month, monthIndex) => {
                        console.log(aggregatedWages, "I am aggregatedWages");
                        const aggregatedWage = aggregatedWages[month];
                        return (
                          <TableCell
                            key={monthIndex}
                            className="border-black border text-black"
                          >
                           {aggregatedWage?.attendance || 0}
                          </TableCell>
                          

                        );
                      })}

                  <TableCell className='border-black border-[1px] text-black'>
                    {employee.totalAttendance}
                  </TableCell>
                  <TableCell className='border-black border-[1px] text-black'>
                    {employee.EL}
                  </TableCell>
                  <TableCell className='border-black border-[1px] text-black'>
                    {employee.CL}
                  </TableCell>
                  <TableCell className='border-black border-[1px] text-black'>
                    {employee.FL}
                  </TableCell>
                  <TableCell className='border-black border-[1px] text-black'>
                    {employee.tot}
                  </TableCell>
                  <TableCell className='border-black border-[1px] text-black'></TableCell>
                </TableRow>
                )
              })}
              {leaveData?.length>0 && (
                <TableRow  className='h-16'>
                <TableCell className='border-black border-[1px] text-black'>
                </TableCell>
                <TableCell className='border-black border-[1px] text-black'>
                </TableCell>
                <TableCell className='border-black border-[1px] text-black'>
                </TableCell>
                <TableCell className='border-black border-[1px] text-black'>
                </TableCell>
                {/* Table data for each day (status) */}
                  <TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell>
                  <TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell><TableCell
                    className='border-black border-[1px] text-black '
                  >
                  </TableCell>

                <TableCell className='border-black border-[1px] text-black'>
                </TableCell>
                <TableCell className='border-black border-[1px] text-black'>
                  {totalEL}
                </TableCell>
                <TableCell className='border-black border-[1px] text-black'>
                  {totalCL}
                </TableCell>
                <TableCell className='border-black border-[1px] text-black'>
                  {totalFL}
                </TableCell>
                <TableCell className='border-black border-[1px] text-black'>
                  {total}
                </TableCell>
                <TableCell className='border-black border-[1px] text-black'></TableCell>
              </TableRow>
              )}
            </TableBody>
          </PDFTable>
        )}
        {!leaveData && (
          <div className='text-red'>NO ATTENDANCE DATA AVAILABLE</div>
        )}
      </div>
    </div>
  );
};

export default Page;
