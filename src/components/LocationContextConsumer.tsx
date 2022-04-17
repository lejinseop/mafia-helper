import type { FC, ReactNode } from 'react';
import { UNSAFE_LocationContext } from 'react-router-dom-v5-compat';

interface LocationContextConsumerProps {
  children: () => ReactNode;
}

const LocationContextConsumer: FC<LocationContextConsumerProps> = ({
  children,
}) => {
  return (
    <UNSAFE_LocationContext.Consumer>
      {children}
    </UNSAFE_LocationContext.Consumer>
  );
};

export default LocationContextConsumer;
