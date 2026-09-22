import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminDelete, adminList, adminSave } from "@/lib/publish.functions";

type Table = "news" | "spotlights" | "events";

export function useAdminTable<T extends { id: string }>(table: Table) {
  const qc = useQueryClient();
  const list = useServerFn(adminList);
  const save = useServerFn(adminSave);
  const remove = useServerFn(adminDelete);

  const query = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => (await list({ data: { table } })) as unknown as T[],
  });

  function refresh() {
    qc.invalidateQueries({ queryKey: ["admin", table] });
    qc.invalidateQueries({ queryKey: [table] });
  }

  async function saveRow(values: unknown, id?: string) {
    try {
      await save({ data: { table, id, values } });
      toast.success(id ? "Saved" : "Published");
      refresh();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
      return false;
    }
  }

  async function deleteRow(id: string) {
    try {
      await remove({ data: { table, id } });
      toast.success("Deleted");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return { data: query.data, saveRow, deleteRow };
}
