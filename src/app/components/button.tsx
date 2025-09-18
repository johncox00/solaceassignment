interface IButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button({ children, onClick, disabled }: IButtonProps) {
  const buttonStyle = "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
  return (
    <button onClick={onClick} className={buttonStyle} disabled={disabled}>{children}</button>
  );
}
