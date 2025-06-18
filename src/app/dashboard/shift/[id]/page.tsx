import { ShiftDetailPage } from "@/components/shift/shift-detail-page";

interface PageProps {
   params: {
      id: string;
   };
}

export default function ShiftDetail({ params }: PageProps) {
   return <ShiftDetailPage shiftId={params.id} />;
}
