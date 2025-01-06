import EditCategoryForm from "../client";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;

  return (
    <>
      <EditCategoryForm categoryId={id} />
    </>
  );
}
