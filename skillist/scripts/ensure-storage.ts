import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

async function ensureResumesBucket() {
  console.log('Checking for "resumes" bucket...')
  const { data, error } = await supabaseAdmin.storage.createBucket('resumes', {
    public: true,
    fileSizeLimit: 5242880,
    allowedMimeTypes: ['application/pdf']
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Bucket "resumes" already exists.')
    } else {
      console.error('Error creating bucket:', error)
    }
  } else {
    console.log('Bucket "resumes" created successfully.')
  }
}

ensureResumesBucket()
