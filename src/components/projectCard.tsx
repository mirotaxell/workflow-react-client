import * as React from 'react';
import {IProject} from '../types/project';
import {useProjectByIdQuery} from '../graphql/useRequest';
import {GET_PROJECT_BY_ID} from '../graphql/graphql';
type Props = {
  project: string;
};

const ProjectCard: React.FC<Props> = ({project}) => {
  const {loading, error, data} = useProjectByIdQuery(
    GET_PROJECT_BY_ID,
    project
  );
  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Something went wrong!</h1>;
  return (
    <div className="Card">
      <h1>{data?.projectById.project_name}</h1>
    </div>
  );
};

export default ProjectCard;
