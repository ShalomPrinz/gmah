interface SearchProps {
  onChange: (query: string) => void;
  placeholder: string;
}

const Search = ({ onChange, placeholder }: SearchProps) => (
  <input
    className="form-control search-input my-3 fs-1 p-4"
    onChange={(e) => onChange(e.currentTarget.value)}
    placeholder={placeholder}
    style={{ border: "5px solid #a4d2f5" }}
    type="text"
  />
);

export default Search;
