import { Pipe, PipeTransform } from '@angular/core';
import { TeamMember } from '../entities/team-member';

@Pipe({
  name: 'projectOwner'
})
export class ProjectOwnerPipe implements PipeTransform {

  transform(value: string, teamMembers: any[]): string {
    let retVal = '';
    if (!value || teamMembers.length == 0) {
      return retVal;
    }
    teamMembers.forEach((mem: TeamMember) => {
      if (mem.uid === value) {
        retVal = mem.displayName;
      }
    });
    return retVal;
  }

}
