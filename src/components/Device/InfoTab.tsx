
interface InfoTabProps {
  device: any;
}

export const InfoTab = ({ device }: InfoTabProps) => {
  return (
    <div className="text-center p-12 text-muted-foreground">
      <p>Device information will be displayed here.</p>
    </div>
  );
};
