export default function userProfile({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}
