import styled from 'styled-components';

const PanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
  color: #2c3e50; // Adding dark text color for better contrast
`;

type PanelProps = {
    title: string;
    children: React.ReactNode;
};

const PanelTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  color: #2c3e50; // Adding dark text color for the title
  font-weight: bold; // Making the title more prominent
`;

const Panel = ({ title, children }: PanelProps) => {
    return (
        <PanelContainer>
            <PanelTitle>{title}</PanelTitle>
            {children}
        </PanelContainer>
    );
};

export default Panel;
