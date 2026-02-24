-- Create a bucket for profile pictures
insert into storage.buckets (id, name, public) 
values ('profile-pictures', 'profile-pictures', true)
on conflict (id) do nothing;

-- Create a bucket for car pictures
insert into storage.buckets (id, name, public) 
values ('car-pictures', 'car-pictures', true)
on conflict (id) do nothing;

-- Allow public read access to profile pictures
create policy "Public Access to Profile Pictures" on storage.objects for select 
using ( bucket_id = 'profile-pictures' );

-- Allow public read access to car pictures
create policy "Public Access to Car Pictures" on storage.objects for select 
using ( bucket_id = 'car-pictures' );

-- Allow authenticated users to upload profile pictures
create policy "Authenticated users can upload profile pictures" on storage.objects for insert 
with check ( auth.role() = 'authenticated' and bucket_id = 'profile-pictures' );

-- Allow authenticated users to upload car pictures
create policy "Authenticated users can upload car pictures" on storage.objects for insert 
with check ( auth.role() = 'authenticated' and bucket_id = 'car-pictures' );

-- Allow users to update their own profile pictures
create policy "Users can update their own profile pictures" on storage.objects for update 
using ( auth.uid() = owner and bucket_id = 'profile-pictures' );

-- Allow users to update their own car pictures
create policy "Users can update their own car pictures" on storage.objects for update 
using ( auth.uid() = owner and bucket_id = 'car-pictures' );

-- Allow users to delete their own profile pictures
create policy "Users can delete their own profile pictures" on storage.objects for delete 
using ( auth.uid() = owner and bucket_id = 'profile-pictures' );

-- Allow users to delete their own car pictures
create policy "Users can delete their own car pictures" on storage.objects for delete 
using ( auth.uid() = owner and bucket_id = 'car-pictures' );
