import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import type { Violation } from '@shared/schema';

export default function ViolationsDashboard() {
  const [newViolation, setNewViolation] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editViolation, setEditViolation] = useState<Violation | null>(null);
  const [editText, setEditText] = useState('');
  const { toast } = useToast();

  const { data: violations = [], isLoading } = useQuery<Violation[]>({
    queryKey: ['/api/violations'],
  });

  const createMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/violations', { text });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/violations'] });
      setNewViolation('');
      toast({
        title: 'تمت الإضافة',
        description: 'تم إضافة المخالفة بنجاح',
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة المخالفة',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, text }: { id: number; text: string }) => {
      const response = await apiRequest('PUT', `/api/violations/${id}`, { text });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/violations'] });
      setEditViolation(null);
      setEditText('');
      toast({
        title: 'تم التعديل',
        description: 'تم تعديل المخالفة بنجاح',
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تعديل المخالفة',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/violations/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/violations'] });
      setDeleteId(null);
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المخالفة بنجاح',
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف المخالفة',
        variant: 'destructive',
      });
    },
  });

  const handleAdd = () => {
    if (!newViolation.trim()) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال نص المخالفة',
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate(newViolation.trim());
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleEdit = () => {
    if (editViolation && editText.trim()) {
      updateMutation.mutate({ id: editViolation.id, text: editText.trim() });
    }
  };

  const openEditDialog = (violation: Violation) => {
    setEditViolation(violation);
    setEditText(violation.text);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00bfa5] to-[#1de9b6] bg-clip-text text-transparent">
            المخالفات
          </h1>
          <p className="text-muted-foreground">نظام إدارة المخالفات - OPPO EGYPT</p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              data-testid="input-new-violation"
              value={newViolation}
              onChange={(e) => setNewViolation(e.target.value)}
              placeholder="أدخل نص المخالفة"
              className="flex-1 h-12 text-right"
              dir="rtl"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdd();
                }
              }}
            />
            <Button
              data-testid="button-add-violation"
              onClick={handleAdd}
              className="h-12 px-6 gap-2"
              disabled={createMutation.isPending}
            >
              <Plus className="w-5 h-5" />
              {createMutation.isPending ? 'جاري الإضافة...' : 'إضافة مخالفة'}
            </Button>
          </div>
        </Card>

        {violations.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">لا توجد مخالفات</h3>
                <p className="text-muted-foreground text-sm">
                  ابدأ بإضافة مخالفة جديدة باستخدام النموذج أعلاه
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground text-right font-semibold h-14">
                      رقم
                    </TableHead>
                    <TableHead className="text-primary-foreground text-right font-semibold h-14">
                      المخالفة
                    </TableHead>
                    <TableHead className="text-primary-foreground text-left font-semibold h-14">
                      إجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {violations.map((violation, index) => (
                    <TableRow
                      key={violation.id}
                      data-testid={`row-violation-${violation.id}`}
                      className="hover-elevate"
                    >
                      <TableCell className="text-right font-medium" data-testid={`text-number-${violation.id}`}>
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-right" dir="rtl" data-testid={`text-violation-${violation.id}`}>
                        {violation.text}
                      </TableCell>
                      <TableCell className="text-left">
                        <div className="flex gap-2 justify-start">
                          <Button
                            data-testid={`button-edit-${violation.id}`}
                            size="sm"
                            variant="secondary"
                            onClick={() => openEditDialog(violation)}
                            className="gap-1 bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            <Pencil className="w-4 h-4" />
                            تعديل
                          </Button>
                          <Button
                            data-testid={`button-delete-${violation.id}`}
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(violation.id)}
                            className="gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">هل أنت متأكد من الحذف؟</AlertDialogTitle>
            <AlertDialogDescription className="text-right" dir="rtl">
              سيتم حذف هذه المخالفة نهائياً ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel data-testid="button-cancel-delete">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              data-testid="button-confirm-delete"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'جاري الحذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editViolation !== null} onOpenChange={() => setEditViolation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-right">تعديل المخالفة</DialogTitle>
            <DialogDescription className="text-right" dir="rtl">
              قم بتعديل نص المخالفة ثم اضغط حفظ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-text" className="text-right block">
                نص المخالفة
              </Label>
              <Input
                id="edit-text"
                data-testid="input-edit-violation"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="text-right h-12"
                dir="rtl"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              data-testid="button-cancel-edit"
              variant="secondary"
              onClick={() => setEditViolation(null)}
            >
              إلغاء
            </Button>
            <Button
              data-testid="button-save-edit"
              onClick={handleEdit}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
