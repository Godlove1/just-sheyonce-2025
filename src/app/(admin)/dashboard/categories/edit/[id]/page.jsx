import EditCategory from "../client";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;

  return (
    <>
      <EditCategory id={id} />
    </>
  );
}
