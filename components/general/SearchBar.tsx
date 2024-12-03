import { FC } from "react";

interface SearchBarProps {
    query: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: FC<SearchBarProps> = ({ query, onChange }) => (
    <div className="mb-4">
        <input
            type="text"
            value={query}
            onChange={onChange}
            className="px-4 py-2 border rounded-md w-full"
            placeholder="Search orders by Order ID, Name, or Status"
        />
    </div>
);

export default SearchBar;
