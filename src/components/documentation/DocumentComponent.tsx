// import styled from 'styled-components';

// const Wrapper = styled.div`
//   border: 1px solid #121212;
//   margin: 20px 0px;
//   color: black;
// `;

// const Container = styled.div`
//   padding: 20px;
//   display: flex;
//   justify-content: space-between;
// `;

// const Title = styled.div`
//   display: flex;
//   justify-content: center;
//   padding-top: 20px;
//   font-size: 1.3rem;
// `;

// const RenderComponent = styled.div`
//   padding: 25px;
//   display: flex;
//   align-items: center;
// `;

// const Documentation = styled.table``;

// const DocumentComponent = ({
//     title,
//     component,
//     propDocs,
// }: {
//     title: string;
//     component: React.ReactNode;
//     propDocs: {
//         prop: string;
//         description: string;
//         type: string;
//         defaultValue: string;
//     }[];
// }) => {
//     return (
//         <Wrapper>
//             <Title>{title}</Title>
//             <Container>
//                 <RenderComponent>{component}</RenderComponent>
//                 <Documentation>
//                     <thead>
//                         <tr>
//                             <th>Prop</th>
//                             <th>Description</th>
//                             <th>Type</th>
//                             <th>Default value</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {propDocs.map(doc => {
//                             return (
//                                 <tr key={doc.description}>
//                                     <td>{doc.prop}</td>
//                                     <td>{doc.description}</td>
//                                     <td>{doc.type}</td>
//                                     <td>
//                                         <code>{doc.defaultValue}</code>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </Documentation>
//             </Container>
//         </Wrapper>
//     );
// };

// export default DocumentComponent;

import styled from 'styled-components';

const Wrapper = styled.div`
    border: 1px solid #121212;
    margin: 20px 0px;
    color: black;
    width: 100%;
    max-width: 1200px;
`;

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
    }
`;

const Title = styled.div`
    display: flex;
    justify-content: center;
    padding: 20px;
    font-size: 1.5rem;
    font-weight: bold;
    background-color: #f5f5f5;
`;

const RenderComponent = styled.div`
    padding: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 300px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Documentation = styled.div`
    overflow-x: auto;
    flex-grow: 1;
    
    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            min-width: 120px;
        }

        th {
            background-color: #f8f9fa;
            font-weight: bold;
            white-space: nowrap;
        }

        td code {
            background-color: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            white-space: nowrap;
        }

        tr:hover td {
            background-color: #f5f5f5;
        }
    }
`;

const DocumentComponent = ({
    title,
    component,
    propDocs,
}: {
    title: string;
    component: React.ReactNode;
    propDocs: {
        prop: string;
        description: string;
        type: string;
        defaultValue: string;
    }[];
}) => {
    return (
        <Wrapper>
            <Title>{title}</Title>
            <Container>
                <RenderComponent>{component}</RenderComponent>
                <Documentation>
                    <table>
                        <thead>
                            <tr>
                                <th>Prop</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Default value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {propDocs.map(doc => {
                                return (
                                    <tr key={doc.prop}>
                                        <td>
                                            <code>{doc.prop}</code>
                                        </td>
                                        <td>{doc.description}</td>
                                        <td>
                                            <code>{doc.type}</code>
                                        </td>
                                        <td>
                                            <code>{doc.defaultValue}</code>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Documentation>
            </Container>
        </Wrapper>
    );
};

export default DocumentComponent;
