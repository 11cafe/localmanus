import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { DownloadIcon } from "lucide-react";

type WorkspaceList = {
  name: string;
  is_dir: boolean;
  path: string;
}[];
export default function WorkspaceSidebar() {
  const [data, setData] = useState<WorkspaceList>([]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch("/api/workspace_list")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        });
    }, 1000); // Refresh every 1 second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold my-1">Workspace</h1>
      <p className="text-sm text-muted-foreground">
        Agent generated files would appear here
      </p>

      <div className="flex flex-col gap-2 text-left p-5">
        {data.map((workspace) => (
          <div key={workspace.name} className="flex gap-2">
            <span>
              {workspace.is_dir && "📁 "}
              {workspace.name}
            </span>
            {!workspace.is_dir && (
              <Button
                size={"xs"}
                variant={"ghost"}
                onClick={() => {
                  const downloadUrl = `/api/workspace_download?path=${encodeURIComponent(
                    workspace.path
                  )}`;
                  const link = document.createElement("a");
                  link.href = downloadUrl;
                  link.download = workspace.name; // Optional: specify a default filename
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <DownloadIcon size={16} />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
