import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { FileText, Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useMeasurements } from '@/hooks/useMeasurements';
import html2canvas from 'html2canvas';
import { PDFDocument, rgb } from 'pdf-lib';

const colorSchemes = [
  {
    name: 'Professional Blue',
    headerBg: 'bg-[linear-gradient(to_right,#1e40af,#1e3a8a,#1e3a8a,#3b82f6,#1e40af,#3b82f6,#2563eb)]',
    headerText: 'text-white',
    accent: 'border-blue-500',
    secondary: 'bg-blue-50',
  },
  {
    name: 'Modern Green',
    headerBg: 'bg-[linear-gradient(to_right,#14532d,#047857,#047857,#10b981,#14532d,#10b981,#047857)]',
    headerText: 'text-white',
    accent: 'border-emerald-500',
    secondary: 'bg-emerald-50',
  },
  {
    name: 'Elegant Purple',
    headerBg: 'bg-[linear-gradient(to_right,#44337a,#44337a,#44337a,#7e3af2,#6c2bd9,#7e3af2,#a78bfa)]',
    headerText: 'text-white',
    accent: 'border-purple-500',
    secondary: 'bg-purple-50',
  },
  {
    name: 'Vibrant Orange',
    headerBg: 'bg-[linear-gradient(to_right,#f59e0b,#f59e0b,#ea580c,#ea580c,#f59e0b,#b45309,#f59e0b,#ea580c)]',
    headerText: 'text-black',
    accent: 'border-orange-500',
    secondary: 'bg-orange-50',
  },
  {
    name: 'Black Luxury',
    headerBg: 'bg-[linear-gradient(to_right,#000000,#1a1a1a,#1a1a1a,#333333,#1a1a1a,#333333,#1a1a1a)]',
    headerText: 'text-white',
    accent: 'border-gray-500',
    secondary: 'bg-gray-50',
  },
  {
    name: 'Golden',
    headerBg: 'bg-[linear-gradient(to_right,#713f12,#a16207,#a16207,#ca8a04,#854d0e,#ca8a04,#a16207)]',
    headerText: 'text-white',
    accent: 'border-yellow-500',
    secondary: 'bg-yellow-50',
  },
  {
    name: 'Silver',
    headerBg: 'bg-[linear-gradient(to_right,#4b5563,#6b7280,#6b7280,#9ca3af,#6b7280,#9ca3af,#6b7280)]',
    headerText: 'text-white',
    accent: 'border-gray-400',
    secondary: 'bg-gray-100',
  },
];

const Invoice = () => {
  const { id } = useParams<{ id: string }>();
  const { measurements, isLoading } = useMeasurements();
  const [invoiceData, setInvoiceData] = useState({
    companyName: '',
    companyPhone: '',
    companyAddress: '',
    companyLogo: null as string | null,
    companyAccountNumber: '',
    companyBankName: '',
    companyAccountName: '',
    companyEmail: '',
  });
  const [selectedColorScheme, setSelectedColorScheme] = useState(0);
  const [measurement, setMeasurement] = useState<any | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedCompanyData = localStorage.getItem('invoiceCompanyData');
    if (savedCompanyData) {
      setInvoiceData(JSON.parse(savedCompanyData));
    }
    const savedColorScheme = localStorage.getItem('invoiceColorScheme');
    if (savedColorScheme) {
      setSelectedColorScheme(parseInt(savedColorScheme, 10));
    }
  }, []);

  useEffect(() => {
    if (!isLoading && measurements.length > 0 && id) {
      const foundMeasurement = measurements.find(m => m.id === id);
      if (foundMeasurement) {
        setMeasurement(foundMeasurement);
      } else {
        toast.error("Measurement record not found");
        navigate('/stitch-scribe-tracker');
      }
    }
  }, [isLoading, measurements, id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceData(prev => {
      const newData = { ...prev, [name]: value };
      localStorage.setItem('invoiceCompanyData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1048576) {
        toast.error("Logo file size must be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setInvoiceData(prev => {
            const newData = { ...prev, companyLogo: event.target?.result as string };
            localStorage.setItem('invoiceCompanyData', JSON.stringify(newData));
            return newData;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorSchemeChange = (index: number) => {
    setSelectedColorScheme(index);
    localStorage.setItem('invoiceColorScheme', index.toString());
  };

  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    toast.info("Generating high-quality PDF...");

    try {
      // Step 1: Capture HTML as canvas with high resolution
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Step 2: Create PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Convert canvas dimensions to PDF points (1px = 0.75 points)
      const pdfPage = pdfDoc.addPage([
        canvas.width * 0.75,
        canvas.height * 0.75
      ]);

      // Step 3: Convert canvas to PNG image
      const pngImage = await pdfDoc.embedPng(canvas.toDataURL('image/png'));
      
      // Step 4: Draw image on PDF
      pdfPage.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: canvas.width * 0.75,
        height: canvas.height * 0.75,
      });

      // Step 5: Add metadata
      pdfDoc.setTitle(`Invoice for ${measurement?.name}`);
      pdfDoc.setAuthor(invoiceData.companyName || 'Your Company');
      pdfDoc.setCreator('StitchScribe Invoice Generator');
      pdfDoc.setKeywords(['invoice', 'tailoring', measurement?.name]);
      pdfDoc.setProducer('pdf-lib + html2canvas');

      // Step 6: Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `invoice_${measurement?.name.replace(/\s/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("High-quality PDF generated!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const currentColors = colorSchemes[selectedColorScheme];
  const today = new Date();
  const formattedDate = format(today, 'MMMM dd, yyyy');

  // Job selection logic
  const selectedJob = location.state?.job;
  let jobToInvoice: any = null;
  if (selectedJob) {
    jobToInvoice = selectedJob;
  } else if (measurement) {
    jobToInvoice = {
      serviceCharge: typeof measurement.serviceCharge === 'number'
        ? measurement.serviceCharge
        : parseFloat(measurement.serviceCharge || '0'),
      paidAmount: typeof measurement.paidAmount === 'number'
        ? measurement.paidAmount
        : parseFloat(measurement.paidAmount || '0'),
      balance: (typeof measurement.serviceCharge === 'number'
        ? measurement.serviceCharge
        : parseFloat(measurement.serviceCharge || '0')) -
        (typeof measurement.paidAmount === 'number'
        ? measurement.paidAmount
        : parseFloat(measurement.paidAmount || '0')),
      collectionDate: measurement.collectionDate,
      serviceChargeCurrency: measurement.serviceChargeCurrency || 'NGN',
      label: 'Initial Job'
    };
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-white min-h-screen">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" /> Invoice Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-0">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={invoiceData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your Company Name"
                />
              </div>
              <div className="space-y-0">
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input
                  id="companyPhone"
                  name="companyPhone"
                  value={invoiceData.companyPhone}
                  onChange={handleInputChange}
                  placeholder="Your Phone Number"
                />
              </div>
              <div className="space-y-0">
                <Label htmlFor="companyBankName">Bank Name</Label>
                <Input
                  id="companyBankName"
                  name="companyBankName"
                  value={invoiceData.companyBankName}
                  onChange={handleInputChange}
                  placeholder="Your Bank Name"
                  type="text"
                />
              </div>
              <div className="space-y-0">
                <Label htmlFor="companyAccountName">Account Name</Label>
                <Input
                  id="companyAccountName"
                  name="companyAccountName"
                  value={invoiceData.companyAccountName}
                  onChange={handleInputChange}
                  placeholder="Your Bank Account Name"
                  type="text"
                />
              </div>
              <div className="space-y-0">
                <Label htmlFor="companyEmail">Email</Label>
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  value={invoiceData.companyEmail}
                  onChange={handleInputChange}
                  placeholder="Your Email Address"
                  type="email"
                />
              </div>
              <div className="space-y-0">
                <Label htmlFor="companyAccountNumber">Bank Account Number</Label>
                <Input
                  id="companyAccountNumber"
                  name="companyAccountNumber"
                  value={invoiceData.companyAccountNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Your Bank Account Number"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={20}
                />
              </div>
              <div className="space-y-0">
                <Label htmlFor="companyAddress">Address</Label>
                <Textarea
                  id="companyAddress"
                  name="companyAddress"
                  value={invoiceData.companyAddress}
                  onChange={handleInputChange}
                  placeholder="Company Address"
                  rows={2}
                />
              </div>
              <div className="space-y-0">
                <Label htmlFor="companyLogo">Company Logo (max 1MB)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="companyLogo"
                    name="companyLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    Select Logo Image
                  </Button>
                </div>
                {invoiceData.companyLogo && (
                  <div className="mt-2">
                    <img 
                      src={invoiceData.companyLogo} 
                      alt="Company Logo" 
                      className="h-16 object-contain"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 text-xs text-destructive"
                      onClick={() => setInvoiceData({...invoiceData, companyLogo: null})}
                    >
                      Remove Logo
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-5 gap-2">
                  {colorSchemes.map((scheme, index) => (
                    <button
                      key={index}
                      className={`h-8 rounded-md ${scheme.headerBg} border-2 ${selectedColorScheme === index ? 'border-black ring-2 ring-offset-2' : 'border-transparent'}`}
                      onClick={() => handleColorSchemeChange(index)}
                      aria-label={`Select ${scheme.name} color scheme`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Selected: {colorSchemes[selectedColorScheme].name}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={generatePDF}
                disabled={!measurement}
              >
                <Download className="h-4 w-4 mr-2" /> Download Invoice PDF
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Invoice Preview */}
        <div className="lg:col-span-2 border rounded-lg shadow-lg overflow-hidden bg-white">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Invoice Preview</h2>
            {!measurement || !jobToInvoice ? (
              <div className="flex justify-center items-center h-[600px] border rounded-lg">
                <p className="text-muted-foreground">No client/job data found</p>
              </div>
            ) : (
              <div ref={invoiceRef} className="border rounded-lg overflow-visible bg-white">
                {/* Invoice Header */}
                <div className={`p-6 ${currentColors.headerBg} ${currentColors.headerText}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl font-bold">{invoiceData.companyName || "Your Company Name"}</h1>
                      <p className="opacity-90">{invoiceData.companyPhone || "Phone Number"}</p>
                      <p className="opacity-90 whitespace-pre-line">{invoiceData.companyAddress || "Company Address"}</p>
                      {invoiceData.companyEmail && (
                      <p>
                        <span className="font-medium">Email:</span> {invoiceData.companyEmail}
                      </p>
                    )}
                    </div>
                    {invoiceData.companyLogo && (
                      <div className="flex-shrink-0">
                        <img 
                          src={invoiceData.companyLogo} 
                          alt="Company Logo" 
                          className="h-20 w-auto object-contain bg-white rounded-md p-1"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Invoice Body */}
                <div className="p-6">
                  <div className="flex justify-between mb-8">
                    <div>
                      <h3 className="font-semibold mb-2">Bill To:</h3>
                      <p className="font-medium text-lg">{measurement.name}</p>
                      <p>{measurement.phone}</p>
                      {measurement.email && <p>{measurement.email}</p>}
                    </div>
                    <div className="text-right">
                      <h3 className="font-semibold mb-2">Invoice Details:</h3>
                      <p><span className="font-medium">Date:</span> {formattedDate}</p>
                      <p><span className="font-medium">Invoice #:</span> INV-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                      {jobToInvoice.collectionDate && (
                        <p>
                          <span className="font-medium">Collection Date:</span> {" "}
                          {format(new Date(jobToInvoice.collectionDate), 'MMMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <table className="min-w-full bg-white">
                      <thead className={`${currentColors.secondary}`}>
                        <tr>
                          <th className="py-2 px-4 border-b text-left">#</th>
                          <th className="py-2 px-4 border-b text-left">Description</th>
                          <th className="py-2 px-4 border-b text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-4 px-4 border-b">1</td>
                          <td className="py-4 px-4 border-b">
                            {jobToInvoice.label || 'Tailoring Services'} for {measurement.name}
                            {measurement.comments && (
                              <p className="text-sm text-gray-600 mt-1">{measurement.comments}</p>
                            )}
                          </td>
                          <td className="py-4 px-4 border-b text-right">
                            {jobToInvoice.serviceChargeCurrency === 'USD' && '$'}
                            {jobToInvoice.serviceChargeCurrency === 'GBP' && '£'}
                            {jobToInvoice.serviceChargeCurrency === 'EUR' && '€'}
                            {jobToInvoice.serviceChargeCurrency === 'CAD' && '$'}
                            {(!jobToInvoice.serviceChargeCurrency || jobToInvoice.serviceChargeCurrency === 'NGN') && '₦'}
                            {' '}
                            {parseFloat(jobToInvoice.serviceCharge || 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className={`${currentColors.secondary} font-medium`}>
                          <td className="py-2 px-4 border-t" colSpan={2}>Total</td>
                          <td className="py-2 px-4 border-t text-right">
                            {jobToInvoice.serviceChargeCurrency === 'USD' && '$'}
                            {jobToInvoice.serviceChargeCurrency === 'GBP' && '£'}
                            {jobToInvoice.serviceChargeCurrency === 'EUR' && '€'}
                            {jobToInvoice.serviceChargeCurrency === 'CAD' && '$'}
                            {(!jobToInvoice.serviceChargeCurrency || jobToInvoice.serviceChargeCurrency === 'NGN') && '₦'}
                            {' '}
                            {parseFloat(jobToInvoice.serviceCharge || 0).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4" colSpan={2}>Paid Amount</td>
                          <td className="py-2 px-4 text-right">
                            {jobToInvoice.serviceChargeCurrency === 'USD' && '$'}
                            {jobToInvoice.serviceChargeCurrency === 'GBP' && '£'}
                            {jobToInvoice.serviceChargeCurrency === 'EUR' && '€'}
                            {jobToInvoice.serviceChargeCurrency === 'CAD' && '$'}
                            {(!jobToInvoice.serviceChargeCurrency || jobToInvoice.serviceChargeCurrency === 'NGN') && '₦'}
                            {' '}
                            {parseFloat(jobToInvoice.paidAmount || 0).toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 font-bold" colSpan={2}>Balance</td>
                          <td className="py-2 px-4 text-right font-bold">
                            {jobToInvoice.serviceChargeCurrency === 'USD' && '$'}
                            {jobToInvoice.serviceChargeCurrency === 'GBP' && '£'}
                            {jobToInvoice.serviceChargeCurrency === 'EUR' && '€'}
                            {jobToInvoice.serviceChargeCurrency === 'CAD' && '$'}
                            {(!jobToInvoice.serviceChargeCurrency || jobToInvoice.serviceChargeCurrency === 'NGN') && '₦'}
                            {' '}
                            {parseFloat(jobToInvoice.balance || 0).toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  {/* Bank & Payment Details */}
                  <div className="mt-8 border-t pt-4 text-sm text-gray-700 bg-white">
                    <h4 className="font-semibold mb-2">Payment/Bank Details</h4>
                    <p>
                      <span className="font-medium">Account Name:</span>{" "}
                      {invoiceData.companyAccountName || <span className="text-gray-400">N/A</span>}
                    </p>
                    <p>
                      <span className="font-medium">Account Number:</span>{" "}
                      {invoiceData.companyAccountNumber || <span className="text-gray-400">N/A</span>}
                    </p>
                    <p>
                      <span className="font-medium">Bank Name:</span>{" "}
                      {invoiceData.companyBankName || <span className="text-gray-400">N/A</span>}
                    </p>
                    
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
