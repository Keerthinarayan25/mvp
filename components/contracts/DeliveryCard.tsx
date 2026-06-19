type Props = {
  delivery: {
    id: number;
    liveUrl: string;
    notes: string;
    createdAt: string;
  };
};

export default function DeliveryCard({
  delivery,
}: Props) {

  return (
    <div className="border rounded-xl p-5 space-y-4">

      <div className="flex justify-between">

        <h3 className="font-semibold">
          Delivery
        </h3>

        <span className="text-sm text-gray-500">
          {new Date(
            delivery.createdAt
          ).toLocaleString()}
        </span>

      </div>

      {delivery.liveUrl && (
        <a
          href={delivery.liveUrl}
          target="_blank"
          className="block text-blue-600 underline"
        >
          Live Demo
        </a>
      )}


      {delivery.notes && (
        <p className="text-gray-700">
          {delivery.notes}
        </p>
      )}

    </div>
  );
}