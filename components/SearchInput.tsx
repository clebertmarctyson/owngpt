"use client";

import { Input } from "@/components/ui/input";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Input
      type="search"
      value={searchParams.get("search") || ""}
      onChange={(e) => handleSearch(e.target.value)}
      className="flex-1 p-8"
      placeholder="Search conversations..."
    />
  );
};

export default SearchInput;
