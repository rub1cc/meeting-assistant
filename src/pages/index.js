import { Breadcrumbs } from "@/components/breadcrumbs";
import { GuestNav } from "@/components/guest-nav";
import { Icons } from "@/components/icons";
import { LoginDialog } from "@/components/login-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import { UserNav } from "@/components/user-nav";
import { createSupabaseComponentClient } from "@/lib/supabase/component";
import {
  cn,
  formatFileName,
  generateRandomString,
  getImageUrl,
} from "@/lib/utils";
import { SelectTrigger } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import get from "lodash.get";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useReducer, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const LANGUAGES = ["English", "Indonesian"];

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_FILE":
      return { ...state, file: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };

    default:
      return state;
  }
};

export default function Page() {
  const supabase = createSupabaseComponentClient();
  const router = useRouter();
  const getMeQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return data;
    },
  });
  const [form, dispatch] = useReducer(formReducer, {
    status: "idle",
    file: null,
    language: "English",
  });

  const [isShowingLoginDialog, setIsShowingLoginDialog] = useState(false);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    accept: {
      "audio/mp3": [],
      "audio/wav": [],
      "video/mp4": [],
      "video/mov": [],
    },
    maxFiles: 1,
    onDropAccepted: async (files) => {
      const file = files[0];
      const reader = new FileReader();
      const audio = document.createElement("audio");

      if (file) {
        reader.onload = function (e) {
          audio.src = e.target.result;
          audio.addEventListener("loadedmetadata", function () {
            dispatch({ type: "SET_FILE", payload: file });
          });
        };
      }

      reader.readAsDataURL(file);
    },
    onDropRejected: (err) => {
      dispatch({ type: "SET_FILE", payload: null });

      const code = err[0].errors[0].code;

      if (code === "too-many-files" || err.length > 1) {
        toast.error("You can only upload one file at a time.");
      }

      if (code === "file-invalid-type") {
        toast.error("We only support MP3, WAV, MP4 and MOV files.");
      }

      if (code === "file-too-large") {
        toast.error(
          "File is too large. Please upload a file smaller than 25MB."
        );
      }
    },
  });

  const handleSummarize = async () => {
    const userId = get(getMeQuery, "data.user.id", null);

    if (!userId) {
      setIsShowingLoginDialog(true);
      return;
    }

    try {
      // upload file to supabase storage
      const fileName = `${userId}/${generateRandomString()}-${form.file.name}`;

      dispatch({ type: "SET_STATUS", payload: "loading" });
      const resUpload = await supabase.storage
        .from("uploads")
        .upload(fileName, form.file);

      if (resUpload.error) {
        dispatch({ type: "SET_STATUS", payload: "idle" });
        toast.error("Failed to upload file. Please try again.");
        return;
      }

      const imageUrl = getImageUrl("uploads", resUpload.data.path);

      const resInsert = await supabase
        .from("meetings")
        .insert({
          user_id: userId,
          title: form.file.name,
          file_url: imageUrl,
          language: form.language,
        })
        .select("id")
        .single();

      if (resInsert.error) {
        dispatch({ type: "SET_STATUS", payload: "idle" });
        toast.error("Failed to create meeting. Please try again.");
        return;
      }

      fetch(`/api/v1/generate?meeting_id=${resInsert.data.id}`);

      router.replace(`/m/${resInsert.data.id}`);
    } catch (err) {
      console.log(err);
      dispatch({ type: "SET_STATUS", payload: "idle" });
    }
  };

  return (
    <div className={inter.className}>
      <div className="p-4 flex justify-between items-center relative z-10">
        <Breadcrumbs />
        <div className="flex gap-4 items-center">
          {getMeQuery.data && getMeQuery.data.user ? (
            <UserNav showUpload={false} />
          ) : (
            <GuestNav />
          )}
        </div>
      </div>
      {form.file ? (
        <div className="flex justify-center items-center fixed inset-0">
          <div className="w-screen max-w-xs space-y-4">
            <h1 className="text-2xl font-bold">Before we start...</h1>
            <Button
              size="xl"
              variant="secondary"
              className="flex justify-between items-center gap-4 group px-4 w-full group cursor-default"
            >
              <div className="flex items-center gap-2">
                <Icons.soundWave className="w-6 h-6 bg-primary text-primary-foreground rounded-sm p-1" />
                <p>{formatFileName(form.file.name)}</p>
              </div>
              <button
                className="opacity-0 transition duration-300 group-hover:opacity-100"
                onClick={() => {
                  if (form.status !== "idle") return;
                  dispatch({ type: "SET_FILE", payload: null });
                }}
              >
                Replace
              </button>
            </Button>
            <Select
              value={form.language}
              onValueChange={(value) => {
                dispatch({ type: "SET_LANGUAGE", payload: value });
              }}
            >
              <SelectTrigger asChild>
                <Button
                  size="xl"
                  variant="secondary"
                  className="flex justify-between items-center gap-4 group px-4 w-full"
                >
                  <p>
                    Language:{" "}
                    <span className="text-blue-500 font-bold">
                      {form.language}
                    </span>
                  </p>
                  <Icons.chevronDown className="w-4 h-4 inline-block ml-2" />
                </Button>
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              disabled={form.status !== "idle"}
              size="xl"
              className="gap-2 w-full"
              onClick={handleSummarize}
            >
              {form.status === "idle" ? (
                <span className="flex items-center gap-2">
                  Summarize
                  <Icons.sparkles className="w-4 h-4" />
                </span>
              ) : (
                <Icons.loading className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "w-full h-full flex justify-center items-center fixed inset-0",
            isDragActive && "z-10"
          )}
          {...getRootProps()}
        >
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold">
              Drop a file to <br />
              summarize it.
            </h1>
            <input {...getInputProps()} />
            <button
              className="flex items-center gap-4 mt-8 group"
              onClick={open}
            >
              <div className="rounded-full bg-primary/10 text-foreground p-2 group-hover:bg-primary/20 transition duration-300">
                <Icons.plus className="w-5 h-5" />
              </div>
              <p>Or upload a file</p>
            </button>
          </div>

          {isDragActive && (
            <div className="absolute inset-0 bg-blue-500 text-white flex justify-center items-center text-8xl">
              Drop it!
            </div>
          )}
        </div>
      )}
      <LoginDialog
        isOpen={isShowingLoginDialog}
        onOpenChange={setIsShowingLoginDialog}
      />
    </div>
  );
}
