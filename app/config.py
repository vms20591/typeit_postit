import os

MONGODB_SETTINGS={
	"host":os.environ.get("MONGODB_HOST","mongodb://localhost/typeit")
}
