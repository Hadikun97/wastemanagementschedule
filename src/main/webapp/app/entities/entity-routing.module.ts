import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'schedule',
        data: { pageTitle: 'Schedules' },
        loadChildren: () => import('./schedule/schedule.module').then(m => m.ScheduleModule),
      },
      {
        path: 'on-duty',
        data: { pageTitle: 'OnDuties' },
        loadChildren: () => import('./on-duty/on-duty.module').then(m => m.OnDutyModule),
      },
      {
        path: 'transport',
        data: { pageTitle: 'Transports' },
        loadChildren: () => import('./transport/transport.module').then(m => m.TransportModule),
      },
      {
        path: 'staff',
        data: { pageTitle: 'Staff' },
        loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule),
      },
      {
        path: 'uwaste',
        data: { pageTitle: 'Uwastes' },
        loadChildren: () => import('./uwaste/uwaste.module').then(m => m.UwasteModule),
      },
      {
        path: 'bulletin',
        data: { pageTitle: 'Bulletins' },
        loadChildren: () => import('./bulletin/bulletin.module').then(m => m.BulletinModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
