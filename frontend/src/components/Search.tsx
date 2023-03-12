interface SearchProps {
  onChange: (query: string) => void;
}

const Search = ({ onChange }: SearchProps) => (
  <input
    className="form-control my-3 fs-1 p-4"
    onChange={(e) => onChange(e.currentTarget.value)}
    placeholder="Search..."
    type="text"
  />
);

export default Search;
