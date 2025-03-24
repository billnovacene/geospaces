
interface EventsTabProps {
  device: any;
}

export const EventsTab = ({ device }: EventsTabProps) => {
  return (
    <div className="text-center p-12 text-muted-foreground">
      <p>Device events will be displayed here.</p>
    </div>
  );
};
