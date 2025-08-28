import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/lib/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { SearchIcon } from "lucide-react";
import React from "react";

export default function Search() {
  const categories = ["men", "women", "kids", "accessories"];
  return (
    <form action="/search" method="GET" className="flex items-stretch h-10">
      {/* Category Dropdown (All button) */}
      <Select name="category">
        <SelectTrigger className="w-20 h-full bg-gray-100 text-black text-sm font-medium border border-r-0 rounded-l-md px-2">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Input */}
      <Input
        className="flex-1 rounded-none bg-gray-100 dark:border-gray-200 text-black text-base h-full 
                   border border-gray-300 focus:outline-none focus:ring-0 focus:border-transparent"
        placeholder={`Search site ${APP_NAME}`}
        name="q"
        type="search"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded-s-none rounded-e-md h-full px-3 py-2"
      >
        <SearchIcon className="w-6 h-6" />
      </button>
    </form>
  );
}
