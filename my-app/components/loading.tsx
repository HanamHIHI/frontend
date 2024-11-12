import { ClimbingBoxLoader } from "react-spinners";
import styled from "styled-components";

export function Loading() {
  return (
    <LoadingWrapper>
        <ClimbingBoxLoader color="#000000" />
    </LoadingWrapper>
  );
};

// export default Loading;

const LoadingWrapper = styled.div`
  display: flex;
  flex-directions: column;
  align-items: center;
  justify-content: center;
`;