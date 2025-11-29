// App.tsx (Modified for Vercel deployment)
// -----------------------------------------------

import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react"; 

// ** تم استيراد ExcelJS هنا بشكل ديناميكي داخل دالة exportToExcel

// ----------------------
// USERS
// ----------------------
const USERS = [
{ email: "fighter@login.com", password: "Fv@2025" },
{ email: "admin@login.com", password: "Admin@2025" },
{ email: "user3@login.com", password: "User3@2025" },
];

// ----------------------
// PrivateRoute Component
// ----------------------
function PrivateRoute({ component: Component }: { component: any }) {
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
const logged = localStorage.getItem("loggedIn") === "true";
setIsLoggedIn(logged);
if (!logged) {
window.location.href = "/login";
}
}, []);

if (!isLoggedIn) return null;
return <Component />;
}

// ----------------------
// Splash Page
// ----------------------
function Splash() {
useEffect(() => {
const timer = setTimeout(() => {
window.location.href = "/login";
}, 1500);
return () => clearTimeout(timer);
}, []);

return (
<div className="min-h-screen flex flex-col items-center justify-center bg-green-600"> 
<h1 
className="text-8xl font-black text-white tracking-widest uppercase mb-10" 
style={{ 
fontFamily: 'Verdana, Arial, sans-serif', 
textShadow: '0 4px 8px rgba(0, 0, 0, 0.4)'
}}
>
OPPO
</h1>
<div 
className="text-white text-lg font-light"
style={{ opacity: 0.8 }}
>
Loading Administration Portal...
</div>
</div>
);
}

// ----------------------
// Login Component
// ----------------------
function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const handleLogin = (e: any) => {
e.preventDefault();
const foundUser = USERS.find(
(u) => u.email === email.trim().toLowerCase() && u.password === password
);

if (foundUser) {
localStorage.setItem("loggedIn", "true");
window.location.href = "/violations";
} else {
setError("Email or password is incorrect.");
}
};

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 to-white">
<form
onSubmit={handleLogin}
className="w-full max-w-md p-10 rounded-[30px] shadow-2xl bg-white space-y-8 relative z-10"
>
<div className="text-center mb-6">
<h2 className="text-4xl font-extrabold text-green-600 tracking-wider">
OPPO
</h2>
<p className="text-sm text-gray-500 font-semibold mt-1">
Administration Portal
</p>
</div>

<h1 className="text-3xl font-bold text-center text-gray-700">تسجيل الدخول</h1>

<Input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="border border-gray-300 rounded-lg p-3"
/>

<Input
type="password"
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="border border-gray-300 rounded-lg p-3"
/>

{error && <p className="text-red-500 text-sm text-center">{error}</p>}

<Button 
type="submit" 
className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
>
تسجيل الدخول
</Button>
</form>
</div>
);
}

// ----------------------
// Violations Page
// ----------------------
interface Violation {
id: number;
name: string;
userId: string;
reason: string;
date: string;
time: string;
deduction: string; 
position: string; 
isSelected: boolean; 
}

interface EmployeeData {
name: string;       
arabicName: string; 
userId: string;     
position: string;   
}

const REASON_OPTIONS = [
"زي مخالف",
"خروج بمعدات وماتريال",
"مأكولات",
" دخول بأشياء مخالفة",
"نسيان ال ID",
"دخول بالفون الشخصي", 
"مخالفة التعليمات",
"أسلوب غير لائق",
"نسيان الزي الرسمي",
];
const REASON_OPTIONS_ID = "reason-list";

const DEDUCTION_OPTIONS = [
"خصم ربع يوم  ",
"خصم نصف يوم",
"خصم يوم",
"خصم يومين",
"خصم ثلاثة أيام",
];
const DEDUCTION_OPTIONS_ID = "deduction-list";

function ViolationsPage() {
const [violations, setViolations] = useState<Violation[]>([]);
const [employees, setEmployees] = useState<EmployeeData[]>([]);

// حالات حقول الإضافة
const [name, setName] = useState(""); 
const [userId, setUserId] = useState(""); 
const [reason, setReason] = useState(""); 
const [deduction, setDeduction] = useState(""); 
const [position, setPosition] = useState("");

// حالات التعديل الشامل
const [editingId, setEditingId] = useState<number | null>(null);
const [editedName, setEditedName] = useState<string>('');
const [editedUserId, setEditedUserId] = useState<string>('');
const [editedReason, setEditedReason] = useState<string>('');
const [editedDeduction, setEditedDeduction] = useState<string>('');
const [editedDate, setEditedDate] = useState<string>('');
const [editedTime, setEditedTime] = useState<string>('');

// حالات التعديل بالجملة
const [bulkNewDate, setBulkNewDate] = useState<string>(''); 

// 🆕 حالات نافذة البحث العربية
const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
const [searchModalQuery, setSearchModalQuery] = useState("");

// 🆕 متغير لتتبع آخر ID تم تصديره
const [lastExportedId, setLastExportedId] = useState<number>(() => {
  const saved = localStorage.getItem('lastExportedId');
  return saved ? parseInt(saved, 10) : 0;
});

// ----------------------------------------------------
// 💾 إدارة حالة الحفظ التلقائي
// ----------------------------------------------------

useEffect(() => {
const storedViolations = localStorage.getItem("violations");
if (storedViolations) {
try {
const parsedViolations: Violation[] = JSON.parse(storedViolations).map((v: Violation) => ({
...v,
isSelected: v.isSelected ?? false
}));
setViolations(parsedViolations);
} catch (e) {
console.error("Error loading violations from localStorage:", e);
}
}

const storedEmployees = localStorage.getItem("employeesData");
if (storedEmployees) {
try {
setEmployees(JSON.parse(storedEmployees));
} catch (e) {
console.error("Error loading employeesData from localStorage:", e);
}
}
}, []);

useEffect(() => {
localStorage.setItem("violations", JSON.stringify(violations));
}, [violations]);

useEffect(() => {
localStorage.setItem("employeesData", JSON.stringify(employees));
}, [employees]);

// ----------------------------------------------------
// 🚀 الدوال الأساسية
// ----------------------------------------------------

const addViolation = () => {
const employeeData = employees.find(
emp => emp.userId.trim() === userId.trim()
);

let finalNameForExport = name; 

if (employeeData && employeeData.name && employeeData.name.trim() !== "") {
finalNameForExport = employeeData.name;
}

if (!finalNameForExport || userId.length < 1 || !reason.trim() || !deduction.trim() || !position.trim()) return; 

const now = new Date();
const initialDate = now.toLocaleDateString('en-CA'); 

const initialTime = now.toLocaleTimeString('en-US', { 
hour: '2-digit', 
minute: '2-digit', 
hour12: false
});

const newViolation: Violation = {
id: violations.length > 0 ? violations[violations.length - 1].id + 1 : 1,
name: finalNameForExport, 
userId,
reason: reason.trim(),
date: initialDate, 
time: initialTime, 
deduction: deduction.trim(), 
position: position.trim(),
isSelected: false,
};

setViolations([...violations, newViolation]);
setName("");
setUserId(""); 
setReason(""); 
setDeduction(""); 
setPosition("");
};

// 🚀 دالة معالجة تغيير الاسم
const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const inputValue = e.target.value; 

const nameRegex = /^[\s\u0600-\u06FFa-zA-Z.-]*$/;

if (!nameRegex.test(inputValue)) {
return;
}

setName(inputValue);
const trimmedInput = inputValue.trim();

const matchedEmployee = employees.find(
emp => emp.name.trim() === trimmedInput || emp.arabicName.trim() === trimmedInput
);

if (matchedEmployee) {
setUserId(matchedEmployee.userId.trim()); 
setPosition(matchedEmployee.position.trim());

if (matchedEmployee.name && matchedEmployee.name.trim() !== "") {
setName(matchedEmployee.name.trim()); 
} else {
setName(matchedEmployee.arabicName || "");
}
} else {
setUserId("");
setPosition("");
}
};

// 🚀 دالة معالجة تغيير الكود
const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const newId = e.target.value.toUpperCase(); 
const idRegex = /^(EG)?[0-9]*$/;

if (!idRegex.test(newId)) {
return;
}

setUserId(newId);
const trimmedId = newId.trim();

const matchedEmployee = employees.find(emp => emp.userId.trim() === trimmedId);

if (matchedEmployee) {
setPosition(matchedEmployee.position.trim()); 

if (matchedEmployee.name && matchedEmployee.name.trim() !== "") {
setName(matchedEmployee.name.trim());
} else {
setName(matchedEmployee.arabicName || "");
}
} else {
setName("");
setPosition("");
}
};

// 🆕 دالة اختيار موظف من نافذة البحث
const handleSelectEmployeeFromSearch = (emp: EmployeeData) => {
setUserId(emp.userId);
setPosition(emp.position);

const nameToSet = (emp.name && emp.name.trim() !== "") ? emp.name : emp.arabicName;
setName(nameToSet);

setIsSearchModalOpen(false);
setSearchModalQuery("");
};

// ----------------------------------------------------
// 🛑 دوال التعديل والحذف والتحديد بالجملة
// ----------------------------------------------------

const toggleSelection = (id: number) => {
setViolations(prevViolations =>
prevViolations.map(v =>
v.id === id ? { ...v, isSelected: !v.isSelected } : v
)
);
};

const toggleAllSelection = (checked: boolean) => {
setViolations(prevViolations =>
prevViolations.map(v => ({ ...v, isSelected: checked }))
);
};

const handleDeleteViolation = (id: number) => {
if (window.confirm("هل أنت متأكد من حذف هذه المخالفة؟")) {
setViolations(prevViolations => prevViolations.filter(v => v.id !== id));
}
};

const handleBulkDateUpdate = () => {
if (!bulkNewDate) {
alert("الرجاء اختيار تاريخ جديد.");
return;
}

const selectedCount = violations.filter(v => v.isSelected).length;

if (selectedCount === 0) {
alert("الرجاء تحديد مخالفة واحدة على الأقل لتحديث تاريخها.");
return;
}

if (window.confirm(`هل أنت متأكد من تغيير تاريخ ${selectedCount} مخالفة إلى ${bulkNewDate}؟`)) {
setViolations(prevViolations =>
prevViolations.map(v =>
v.isSelected
? { ...v, date: bulkNewDate, isSelected: false }
: v
)
);
setBulkNewDate(''); 
}
};

const handleEdit = (v: Violation) => {
setEditingId(v.id);
setEditedName(v.name);
setEditedUserId(v.userId);
setEditedReason(v.reason);
setEditedDeduction(v.deduction);
setEditedDate(v.date);
setEditedTime(v.time);
};

const handleSave = (id: number) => {
const nameRegex = /^[\s\u0600-\u06FFa-zA-Z.-]*$/;
const idRegex = /^(EG)?[0-9]*$/;

if (!nameRegex.test(editedName) || !idRegex.test(editedUserId)) {
alert("الرجاء التحقق من صحة الاسم (حروف فقط) ورقم ID (EG متبوعاً بأرقام).");
return;
}

setViolations(
violations.map((v) =>
v.id === id
? { 
...v, 
name: editedName, 
userId: editedUserId.toUpperCase(), 
reason: editedReason,
deduction: editedDeduction,
date: editedDate, 
time: editedTime,
} 
: v
)
);
setEditingId(null);
setEditedName('');
setEditedUserId('');
setEditedReason('');
setEditedDeduction('');
setEditedDate('');
setEditedTime('');
};

const handleCancel = () => {
setEditingId(null);
setEditedName('');
setEditedUserId('');
setEditedReason('');
setEditedDeduction('');
setEditedDate('');
setEditedTime('');
};

const handleLogout = () => { 
localStorage.removeItem("loggedIn");
window.location.href = "/login";
};

// 💡 دالة تنسيق الخلايا متعددة اللغات (إصلاح مشكلة [object Object])
const formatMultilingualCell = (text: string | null | undefined): string => {
if (!text) return "";

// التعامل مع تنسيق (نص عربي / نص صيني)
const parts = text.split('/').map(p => p.trim()).filter(p => p.length > 0);

if (parts.length >= 2) {
// إذا كان يحتوي على /، نعرض الصيني أولاً ثم العربي
// مثال: "خصم يوم / 一天扣除" -> "一天扣除\nخصم يوم"
return `${parts[1]}\n${parts[0]}`; 
}
// إذا لم يكن يحتوي على /، يعرض النص كما هو
return text;
};

// 🚀 دالة التصدير المحدثة (بتاخد مود: 'new' أو 'all')
const exportToExcel = async (mode: 'new' | 'all' = 'all') => {
    try {
        const ExcelJS = (await import('exceljs')).default;

        // فلترة المخالفات حسب المود المختار
        let violationsToExport = violations;
        if (mode === 'new') {
            violationsToExport = violations.filter(v => v.id > lastExportedId);
            if (violationsToExport.length === 0) {
                alert("لا توجد مخالفات جديدة لتصديرها.");
                return;
            }
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1', {
            views: [{ state: 'frozen', ySplit: 1 }]
        });

        const headers = [
            { header: '序号\nNum', key: 'id', width: 6 },
            { header: '工号\nCode', key: 'code', width: 12 },
            { header: '名字\nName', key: 'name', width: 30 },
            { header: '部门\nDepartment', key: 'department', width: 25 },
            { header: '日期\nDate', key: 'date', width: 30 },
            { header: '违纪种类\nType of discipclinary\nviolations', key: 'type', width: 35 },
            { header: '违纪事项\nDisciplinary Matters', key: 'matter', width: 35 },
            { header: '违纪金额\nViolation Amount', key: 'amount', width: 20 },
        ];

        worksheet.columns = headers.map(h => ({
            header: h.header,
            key: h.key,
            width: h.width,
            style: {
                font: { name: 'Calibri', size: 11 },
                alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }
            }
        }));

        const headerRow = worksheet.getRow(1);
        headerRow.height = 60;
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF104470' } };
            cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12, name: 'Calibri' };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        violationsToExport.forEach((v, index) => {
            const dateObj = new Date(v.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            const row = worksheet.addRow({
                id: index + 1,
                code: v.userId,
                name: v.name,
                department: v.position || 'Production Dep\n生产部',
                date: formattedDate,
                type: formatMultilingualCell(v.reason),
                matter: formatMultilingualCell(v.reason),
                amount: formatMultilingualCell(v.deduction),
            });

            row.height = 35;
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.font = { name: 'Calibri', size: 11 };
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            });
        });

        worksheet.autoFilter = { from: 'A1', to: 'H1' };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // تعديل اسم الملف ليعكس نوع التصدير
        const fileNameSuffix = mode === 'new' ? '_New_Violations' : '_Full_Report';
        a.download = `Violations_Report_${fileNameSuffix}_${new Date().toLocaleDateString('en-CA')}.xlsx`;

        a.click();
        window.URL.revokeObjectURL(url);

        // 💾 تحديث آخر ID تم تصديره بعد نجاح العملية
        const latestId = Math.max(...violations.map(v => v.id), 0);
        setLastExportedId(latestId);
        localStorage.setItem('lastExportedId', latestId.toString());

        alert(`تم التصدير بنجاح! (${violationsToExport.length} مخالفة)`);

    } catch (e) {
        console.error("Export failed. Make sure 'exceljs' library is installed.", e);
        alert("فشل التصدير. يرجى التأكد من تثبيت مكتبة 'exceljs'.");
    }
};

const handlePrint = () => {
const violationsToPrint = violations.filter(v => v.isSelected).length > 0
? violations.filter(v => v.isSelected)
: violations; 

const printWindow = window.open('', '', 'height=600,width=800');
if (!printWindow) {
alert("يرجى السماح بفتح النوافذ المنبثقة للطباعة.");
return;
}

const tableHtml = `
<style>
body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; margin: 20px; }
h1 { text-align: center; margin-bottom: 20px; color: #264653; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
th { background-color: #4CAF50; color: white; font-size: 10px; height: 30px; vertical-align: middle; }
.multilingual-header { white-space: pre-wrap; line-height: 1.2; }
</style>
<h1>تقرير المخالفات - OPPO</h1>
<table>
<thead>
<tr>
<th class="multilingual-header">序号\nNo.</th>
<th class="multilingual-header">اسم المخالف\n违规人姓名\nOffender Name</th>
<th class="multilingual-header">ID المخالف\n用户编号\nUser ID</th>
<th class="multilingual-header">المنصب/القسم\n部门\nPosition</th>
<th class="multilingual-header">سبب المخالفة\n原因\nReason</th>
<th class="multilingual-header">الخصم\n扣除\nDeduction</th>
<th class="multilingual-header">التاريخ\n日期\nDate</th>
<th class="multilingual-header">الوقت\n时间\nTime</th>
</tr>
</thead>
<tbody>
 ${violationsToPrint.map((v, index) => `
<tr>
<td>${index + 1}</td>
<td>${v.name}</td>
<td>${v.userId}</td>
<td>${v.position}</td>
<td>${v.reason}</td>
<td>${v.deduction}</td>
<td>${new Date(v.date).toLocaleDateString()}</td>
<td>${v.time}</td>
</tr>
`).join('')}
</tbody>
</table>
`;

printWindow.document.write(`
<html>
<head>
<title>Violations Report</title>
</head>
<body>
 ${tableHtml}
<script>
window.onload = function() {
window.print();
window.close();
};
</script>
</body>
</html>
`);
printWindow.document.close();
};

// 🚀 دالة استيراد بيانات الموظفين (معدلة لاستخراج النص النظيف من الكائنات)
const importEmployeeData = async (file: File) => {
try {
const ExcelJS = (await import('exceljs')).default;
const workbook = new ExcelJS.Workbook();
const reader = new FileReader();

reader.onload = async (e) => {
const buffer = e.target?.result as ArrayBuffer;
await workbook.xlsx.load(buffer);

const worksheet = workbook.worksheets[0];

const importedEmployees: EmployeeData[] = [];
let totalRecordsRead = 0;
let skippedRecords = 0;

// 💡 دالة مساعدة لاستخراج النص النظيف من أي خلية (نص، رابط، نص ملون، معادلة)
const getCellValue = (cellValue: any): string => {
if (cellValue === null || cellValue === undefined) return "";
if (typeof cellValue === 'object') {
// التعامل مع Rich Text (مصفوفة من النصوص)
if (cellValue.richText && Array.isArray(cellValue.richText)) {
return cellValue.richText.map((rt: any) => rt.text).join('');
}
// التعامل مع الروابط (Hyperlinks)
if (cellValue.text) return cellValue.text.toString(); 
// التعامل مع المعادلات (Formula)
if (cellValue.result) return cellValue.result.toString(); 
}
return cellValue.toString();
};

worksheet.eachRow((row, rowNumber) => {
if (rowNumber > 1) { 
totalRecordsRead++;

const values = row.values as any[]; 

// استخدام getCellValue لتنظيف القيم
const englishName = getCellValue(values[1]).trim(); 
const arabicName = getCellValue(values[2]).trim();    
const employeeId = getCellValue(values[3]).trim();    
const position = getCellValue(values[4]).trim(); 

if (employeeId.length > 0 && (englishName.length > 0 || arabicName.length > 0)) {
const newEmployeeData: EmployeeData = {
userId: employeeId, 
name: englishName,
arabicName: arabicName, 
position: position, 
};
importedEmployees.push(newEmployeeData);
} else {
skippedRecords++;
}
}
});

setEmployees(importedEmployees);

alert(`تمت العملية بنجاح!
تم استيراد: ${importedEmployees.length} سجل.
تم تخطي: ${skippedRecords} سجل.
إجمالي عدد الموظفين في النظام: ${importedEmployees.length} سجل.`);
};

reader.readAsArrayBuffer(file);
} catch (e) {
console.error("Import failed:", e);
alert("فشل الاستيراد. يرجى التأكد من أن الملف بصيغة XLSX وصالح.");
}
};

// 🆕 دالة لفلترة الموظفين في النافذة المنبثقة
const filteredEmployees = employees.filter(emp => {
if (!searchModalQuery) return false;
const q = searchModalQuery.trim().toLowerCase();
return (
(emp.arabicName && emp.arabicName.toLowerCase().includes(q)) || 
(emp.name && emp.name.toLowerCase().includes(q)) || 
(emp.userId && emp.userId.includes(q))
);
});

return (
<div className="p-8 bg-gray-50 min-h-screen"> 
<div className="flex justify-between items-center mb-6">

{/* تصميم هيدر جذاب بشعار Oppo */}
<div className="flex items-center space-x-4 space-x-reverse">
{/* دائرة خضراء تمثل الشعار مع حرف O */}
<div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-600 shadow-lg border-2 border-white">
<span className="text-white text-3xl font-bold font-sans tracking-tighter">O</span> 
</div>

{/* النصوص */}
<div className="flex flex-col items-start">
<h1 className="text-4xl font-black text-green-800 tracking-wide drop-shadow-sm">
إدارة المخالفات
</h1>
<div className="text-sm font-semibold text-gray-500 mt-0.5 flex space-x-3 space-x-reverse items-center">
<span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">违规管理</span>
<span className="text-gray-400">|</span>
<span className="tracking-tight text-gray-600">Violations Management</span>
</div>
</div>
</div>

{/* حاوية أزرار الإجراءات العلوية */}
<div className="flex space-x-4 space-x-reverse">

{/* 🚀 زر استيراد بيانات الموظفين */}
<label className="bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg px-4 py-2 flex flex-col items-center justify-center h-12 cursor-pointer transition-colors shadow-sm active:scale-95 transform duration-100">
<span>استيراد بيانات الموظفين (استبدال)</span>
<span className="text-xs opacity-90">Import Employee Data (Overwrite)</span>
<Input
type="file"
accept=".xlsx"
className="hidden"
onChange={(e) => {
const file = e.target.files?.[0];
if (file) {
importEmployeeData(file);
e.target.value = ''; 
}
}}
/>
</label>

{/* 🆕 حاوية أزرار التصدير الجديدة */}
<div className="flex flex-col space-y-2">
    <Button
        onClick={() => exportToExcel('all')}  
        className="bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg px-4 py-2 flex flex-col items-center justify-center h-12 shadow-sm active:scale-95 transform duration-100"
    >
        <span>تصدير تقرير شامل</span>
        <span className="text-xs opacity-90">Export Full Report</span>
    </Button>
    <Button
        onClick={() => exportToExcel('new')}  
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-4 py-2 flex flex-col items-center justify-center h-12 shadow-sm active:scale-95 transform duration-100"
    >
        <span>تصدير الجديد فقط</span>
        <span className="text-xs opacity-90">Export New Only</span>
    </Button>
</div>

<Button
onClick={handleLogout}
className="bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg px-4 py-2 flex flex-col items-center justify-center h-12 shadow-sm active:scale-95 transform duration-100"
>
<span>تسجيل خروج</span>
<span className="text-xs opacity-90">登出 / Logout</span> 
</Button>
</div>
</div>

{/* حقول الإدخال */}
<div className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-5 gap-4 border-t-4 border-green-600"> 

{/* 1. حقل اسم المخالف + زر البحث الجديد */}
<div className="col-span-1 relative flex">
<Input
list="employee-names-list"
placeholder="Offender Name / اسم المخالف"
value={name}
onChange={handleNameChange} 
className="w-full p-3 border border-gray-300 rounded-r-lg rounded-l-none bg-white h-12 text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
/>
<Button 
onClick={() => setIsSearchModalOpen(true)}
className="h-12 rounded-l-lg rounded-r-none bg-blue-600 hover:bg-blue-700 text-white px-3 transition-colors"
title="بحث متقدم (عربي)"
>
<Search size={20} />
</Button>
</div>

{/* 2. حقل ID المخالف */}
<Input
list="employee-ids-list"
placeholder="违规人编号\nOffender ID / ID المخالف"
value={userId}
onChange={handleIdChange} 
className="col-span-1 p-3 border border-gray-300 rounded-lg bg-white w-full h-12 text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
/>

{/* 3. حقل المنصب */}
<Input
placeholder="منصب/قسم\nPosition/Department"
value={position} 
readOnly 
className="p-3 border border-gray-300 rounded-lg bg-gray-100 w-full h-12 col-span-1 text-right text-gray-600" 
/>
{/* 4. حقل سبب المخالفة */}
<Input
list={REASON_OPTIONS_ID}
placeholder="请选择原因\nReason / سبب المخالفة"
value={reason}
onChange={(e) => setReason(e.target.value)}
className="p-3 border border-gray-300 rounded-lg bg-white w-full h-12 col-span-1 text-right focus:ring-2 focus:ring-green-500 focus:border-transparent" 
/>

{/* 5. حقل الخصم */}
<Input
list={DEDUCTION_OPTIONS_ID}
placeholder="扣除\nDeduction / خصم"
type="text" 
value={deduction}
onChange={(e) => setDeduction(e.target.value)}
className="p-3 border border-gray-300 rounded-lg bg-white w-full h-12 col-span-1 text-right focus:ring-2 focus:ring-green-500 focus:border-transparent" 
/>

</div>

{/* 🛑 شريط الأدوات الجديد */}
<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

{/* زر إضافة مخالفة */}
<Button
onClick={addViolation}
className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex flex-col items-center justify-center h-12 px-8 w-full md:w-auto shadow-md hover:shadow-lg transform transition-all active:scale-95"
>
<span className="text-lg">إضافة مخالفة</span>
<span className="text-xs opacity-90">添加违规 / Add Violation</span>
</Button>

{/* أدوات التعديل بالجملة والطباعة */}
<div className="flex items-center gap-4 w-full md:w-auto justify-end">

{/* تعيين التاريخ */}
<div className="flex items-center space-x-2 space-x-reverse bg-yellow-50 p-1.5 rounded-lg border border-yellow-200 shadow-sm">
<Input
type="date"
value={bulkNewDate}
onChange={(e) => setBulkNewDate(e.target.value)}
className="w-36 h-9 text-right text-xs bg-white border-gray-300 focus:ring-1 focus:ring-yellow-500"
/>
<Button
onClick={handleBulkDateUpdate}
className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-md px-3 py-1 flex flex-col items-center justify-center h-9 text-xs shadow-sm transition-colors"
>
<span>تعيين التاريخ</span>
<span className="text-[10px]">Set Date</span>
</Button>
</div>

{/* طباعة */}
<Button
onClick={handlePrint}
className="bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg px-6 py-2 flex flex-col items-center justify-center h-12 min-w-[90px] shadow-md transition-colors"
>
<span>طباعة</span>
<span className="text-xs opacity-90">打印 / Print</span>
</Button>
</div>
</div>

{/* تعريف قوائم Datalist للخيارات الثابتة */}
<datalist id={REASON_OPTIONS_ID}> 
{REASON_OPTIONS.map((option, index) => (
<option key={index} value={option} />
))}
</datalist>

<datalist id={DEDUCTION_OPTIONS_ID}>
{DEDUCTION_OPTIONS.map((option, index) => (
<option key={index} value={option} />
))}
</datalist>

{/* تعريف قوائم Datalist لبيانات الموظفين المستوردة */}
<datalist id="employee-names-list">
{employees.map((emp, index) => (
<>
<option key={`en-${index}`} value={emp.name} />
{emp.arabicName && <option key={`ar-${index}`} value={emp.arabicName} />}
</>
))}
</datalist>

{/* تعريف قوائم Datalist لـ ID الموظفين */}
<datalist id="employee-ids-list">
{employees.map((emp, index) => (
<option key={index} value={emp.userId} />
))}
</datalist>

{/* جدول عرض المخالفات */}
<div className="overflow-x-auto">
<table className="w-full bg-white shadow-md rounded-xl overflow-hidden">
<thead className="bg-green-700 text-white">
<tr>
{/* 🛑 الترقيم */}
<th className="p-3 text-center w-12 whitespace-nowrap font-semibold border-r border-green-600">
<div>序号</div>
<div className="text-xs font-light opacity-80">No.</div>
</th>

{/* 🛑 تحديد الكل */}
<th className="p-3 text-center w-12 border-r border-green-600">
<Input
type="checkbox"
checked={violations.length > 0 && violations.every(v => v.isSelected)}
onChange={(e) => toggleAllSelection(e.target.checked)}
className="w-4 h-4 mx-auto cursor-pointer accent-yellow-400"
/>
</th>

<th className="p-3 text-center whitespace-nowrap border-r border-green-600">
<div>اسم المخالف</div>
<div className="text-xs font-light opacity-80">违规人姓名\nOffender Name</div>
</th>
<th className="p-3 text-center whitespace-nowrap border-r border-green-600">
<div>ID المخالف</div>
<div className="text-xs font-light opacity-80">用户编号\nUser ID</div>
</th>
<th className="p-3 text-center whitespace-nowrap border-r border-green-600">
<div>المنصب/القسم</div>
<div className="text-xs font-light opacity-80">部门\nPosition</div>
</th>
<th className="p-3 text-center whitespace-nowrap border-r border-green-600">
<div>سبب المخالفة</div>
<div className="text-xs font-light opacity-80">原因\nReason</div>
</th>

<th className="p-3 text-center whitespace-nowrap border-r border-green-600">
<div>الخصم</div>
<div className="text-xs font-light opacity-80">扣除\nDeduction</div>

</th>

<th className="p-3 text-center whitespace-nowrap border-r border-green-600">
<div>التاريخ</div>
<div className="text-xs font-light opacity-80">日期\nDate</div>
</th>
<th className="p-3 text-center whitespace-nowrap w-40">
<div>الإجراءات</div>
<div className="text-xs font-light opacity-80">操作\nActions</div>
</th>
</tr>
</thead>
<tbody className="text-gray-700">
{violations.map((v, index) => (
<tr key={v.id} className={`text-center border-b transition-colors ${v.isSelected ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>

{/* 🛑 الترقيم */}
<td className="p-3 font-bold text-gray-500 border-r">{index + 1}</td>

{/* 🛑 خانة التحديد */}
<td className="p-3 border-r">
<Input
type="checkbox"
checked={v.isSelected}
onChange={() => toggleSelection(v.id)}
className="w-4 h-4 mx-auto cursor-pointer accent-green-600"
/>
</td>

{/* 🛑 الاسم */}
<td className="p-3 border-r font-medium">
{editingId === v.id ? (
<Input
value={editedName}
onChange={(e) => setEditedName(e.target.value)}
className="w-full text-center text-sm border-blue-300 focus:ring-1 focus:ring-blue-500"
/>
) : (
v.name
)}
</td>

{/* 🛑 ID */}
<td className="p-3 border-r">
{editingId === v.id ? (
<Input
value={editedUserId}
onChange={(e) => setEditedUserId(e.target.value)}
className="w-full text-center text-sm border-blue-300 focus:ring-1 focus:ring-blue-500"
/>
) : (
<span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{v.userId}</span>
)}
</td>

{/* المنصب */}
<td className="p-3 border-r text-sm text-gray-600">{v.position}</td>

{/* 🛑 سبب المخالفة */}
<td className="p-3 border-r">
{editingId === v.id ? (
<Input
list={REASON_OPTIONS_ID}
value={editedReason}
onChange={(e) => setEditedReason(e.target.value)}
className="w-full text-center text-sm border-blue-300 focus:ring-1 focus:ring-blue-500"
/>
) : (
v.reason
)}
</td>

{/* 🛑 الخصم */}
<td className="p-3 border-r">
{editingId === v.id ? (
<Input
list={DEDUCTION_OPTIONS_ID}
value={editedDeduction}
onChange={(e) => setEditedDeduction(e.target.value)}
className="w-full text-center text-sm border-blue-300 focus:ring-1 focus:ring-blue-500"
/>
) : (
<span className="font-bold text-red-600">{v.deduction}</span>
)}
</td>

{/* 🛑 التاريخ والوقت */}
<td className="p-3 border-r text-sm">
{editingId === v.id ? (
<div className="flex flex-col space-y-1">
<Input
type="date"
value={editedDate}
onChange={(e) => setEditedDate(e.target.value)}
className="text-center text-xs"
/>
<Input
type="time"
value={editedTime}
onChange={(e) => setEditedTime(e.target.value)}
className="text-center text-xs"
/>
</div>
) : (
<div className="space-y-0.5">
<div>{v.date}</div>
<div className="text-xs text-gray-500">{v.time}</div>
</div>
)}
</td>

{/* 🛑 الإجراءات */}
<td className="p-3">
{editingId === v.id ? (
<div className="flex justify-center space-x-2 space-x-reverse">
<Button
onClick={() => handleSave(v.id)}
className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-8"
>
حفظ
</Button>
<Button
onClick={handleCancel}
className="bg-gray-400 hover:bg-gray-500 text-white text-sm h-8"
>
إلغاء
</Button>
</div>
) : (
<div className="flex justify-center space-x-2 space-x-reverse">
<Button
onClick={() => handleEdit(v)}
className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm h-8"
>
تعديل
</Button>
<Button
onClick={() => handleDeleteViolation(v.id)}
className="bg-red-600 hover:bg-red-700 text-white text-sm h-8"
>
حذف
</Button>
</div>
)}
</td>
</tr>
))}
</tbody>
</table>
</div>

{/* نافذة البحث المنبثقة (Search Modal) */}
{isSearchModalOpen && (
<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
<div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative">
<div className="flex justify-between items-center border-b pb-3 mb-4">
<h2 className="text-xl font-bold text-gray-700">البحث واختيار الموظف</h2>
<Button
onClick={() => setIsSearchModalOpen(false)}
className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
>
<X size={20} className="text-gray-600" />
</Button>
</div>

<Input
type="text"
placeholder="ابحث بالاسم العربي/الإنجليزي أو الكود"
value={searchModalQuery}
onChange={(e) => setSearchModalQuery(e.target.value)}
className="w-full p-3 border border-blue-300 rounded-lg mb-4 text-right focus:ring-2 focus:ring-blue-500"
/>

<div className="max-h-80 overflow-y-auto space-y-2">
{filteredEmployees.length > 0 ? (
filteredEmployees.map((emp, index) => (
<div
key={index}
className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors"
onClick={() => handleSelectEmployeeFromSearch(emp)}
>
<div className="text-right">
<div className="font-bold text-gray-800">
{emp.name || emp.arabicName}
</div>
<div className="text-sm text-gray-500">
{emp.userId} - {emp.position}
</div>
</div>
<Button className="bg-green-600 hover:bg-green-700 text-white h-8 text-sm">
اختيار
</Button>
</div>
))
) : searchModalQuery ? (
<p className="text-center text-gray-500">لا توجد نتائج مطابقة.</p>
) : (
<p className="text-center text-gray-500">ابدأ الكتابة للبحث عن موظف...</p>
)}
</div>
</div>
</div>
)}

</div>
);
}

// ----------------------
// Main App Component
// ----------------------
function App() {
return (
<QueryClientProvider client={queryClient}>
<TooltipProvider>
<Switch>
<Route path="/" component={Splash} />
<Route path="/login" component={Login} />
<Route path="/violations">
<PrivateRoute component={ViolationsPage} />
</Route>
{/* Fallback route for unmatched paths */}
<Route>
<div className="min-h-screen flex items-center justify-center bg-gray-100">
<div className="text-center p-8 bg-white rounded-lg shadow-lg">
<h1 className="text-2xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
<p className="text-gray-600">The page you are looking for does not exist.</p>
<Button 
onClick={() => window.location.href = "/"}
className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg px-4 py-2"
>
Go to Home
</Button>
</div>
</div>
</Route>
</Switch>
<Toaster />
</TooltipProvider>
</QueryClientProvider>
);
}

export default App;
