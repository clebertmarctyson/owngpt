"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const delay = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      router.replace(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <Input
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 p-8"
      placeholder="Search conversations..."
    />
  );
};

export default SearchInput;
