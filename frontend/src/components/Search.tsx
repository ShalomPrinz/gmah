interface SearchProps {
  onChange: (query: string) => void;
  placeholder: string;
}

const Search = ({ onChange, placeholder }: SearchProps) => (
  <input
    className="form-control my-3 fs-1 p-4"
    onChange={(e) => onChange(e.currentTarget.value)}
    placeholder={placeholder}
    type="text"
  />
);

export default Search;
